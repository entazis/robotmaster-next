import fs from "fs";
import path from "path";
import countryList from '../../translations/locales/country-list.json';

function sendEmail(ses, sourceEmailAddress, destEmailAddress, subject, email) {
  ses.sendEmail({
    Source: sourceEmailAddress,
    Destination: {
      ToAddresses: [destEmailAddress],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: email,
        },
      },
    },
  }, function(err) {
    if (err) {
      console.log('ERROR | REQUEST-INFORMATION | sendEmail | ', e);
    }
  });
}

function validateForm(form) {
  const validation = {
    success: true,
    messages: [],
  };

  if (!form.name) {
    validation.success = false;
    validation.messages.push('You must include your name.');
  }

  if (!form.email) {
    validation.success = false;
    validation.messages.push('You must include an email address.');
  }

  if (!form.company) {
    validation.success = false;
    validation.messages.push('You must include a company name.');
  }

  if (!form.country) {
    validation.success = false;
    validation.messages.push('You must include a country.');
  }

  if (!form.phone) {
    validation.success = false;
    validation.messages.push('You must include a phone number.');
  }

  if (form.robot) {
    validation.success = false;
    validation.messages.push('You must be a human.');
  }

  //TODO: check this out
  if (form.requestingPage === 'trial_request') {
    validation.success = true;
  }

  return validation;
}

function getDictionary() {
  const localesDirectory = path.join(process.cwd(), 'translations/locales');
  const fileNames = fs.readdirSync(localesDirectory);
  const dictionary = {};

  for (const fileName of fileNames) {
    const fullPath = path.join(localesDirectory, fileName);
    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        const locale = fullPath.slice(-2);
        dictionary[locale] = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      }
    } catch (e) {
      console.log('ERROR | REQUEST-INFORMATION | getDictionary | ', e);
    }
  }

  return dictionary;
}

function assembleRobotMasterEmailFor(req, requestingPage) {

  //TODO: switch(requestingPage) which template to use
  //TODO: add templates

  try {
    const template = fs.readFileSync(path.join(__dirname, 'form.tpl'));
    return mustache.render(template, req.body);
  } catch (e) {
    console.log('ERROR | REQUEST-INFORMATION | assembleRobotMasterEmail | ', e);
  }
}

function assembleConfirmationEmail(req, dictionary) {
  const confirmationEmailMessage = {
    name: req.body.name,
    message: req.body.requestingPage === 'live-demo' ?
        dictionary[language]['confirmation-email-live-demo-message'] :
        dictionary[language]['confirmation-email-contact-message'],
  };

  try {
    const template = fs.readFileSync(path.join(__dirname, '../localization/' + language + '/confirmationMail.tpl'));
    return mustache.render(template, confirmationEmailMessage);
  } catch (e) {
    console.log('ERROR | REQUEST-INFORMATION | assembleRobotMasterEmail | ', e);
  }
}

function handlePostRequest(req, res) {
  const validation = validateForm(req.body);
  if (!validation.success) {
    return res.json(validation);
  }
  res.messages.push('Your request has been sent, someone will be in touch with you shortly.');

  const requestingPage = req.body.requestingPage;
  const language = req.body.language;
  const dictionary = getDictionary();

  const ses = new aws.SES();

  if (requestingPage === 'trial_request') {
    const emailForRobotMaster = assembleRobotMasterEmailFor(req, requestingPage);

    sendEmail(
        path.join(__dirname, req.body.formName),
        ses,
        'trials@robotmaster.com',
        'trials@robotmaster.com',
        'Robotmaster Information Request - Page: ' + requestingPage,
        req.body,
    );
  } else {
    const sourceEmailAddress = (requestingPage === 'live-demo') ?
        'sales@robotmaster.com' :
        'info@robotmaster.com';
    const destEmailAddress = req.body.state ?
        countryList
        .find(country => country.countryCode === 'US')
        .states.find(state => state.stateCode === req.body.state).email
        :
        countryList
        .find(country => country.name === req.body.country).email;

    const emailForRobotMaster = assembleRobotMasterEmailFor(req);
    const emailForCustomer = assembleConfirmationEmail(req, dictionary);

    sendEmail(
        ses,
        sourceEmailAddress,
        destEmailAddress,
        'Robotmaster Information Request - Page: ' + requestingPage,
        emailForRobotMaster,
    );

    sendEmail(
        ses,
        '"Robotmaster" <' + sourceEmailAddress + '>',
        req.body.email,
        dictionary[language]['confirmation-email-subject'],
        emailForCustomer,
    );
  }
}

export default (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ name: 'John Doe' }));

  if (req.method === 'POST') {
    handlePostRequest(req, res);

  } else {
    // Handle any other HTTP method
  }
};