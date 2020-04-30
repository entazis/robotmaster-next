import React from 'react';
import withLocale from '../../../hocs/withLocale';
import Layout from '../../../components/layout/layout';
import useTranslation from '../../../hooks/useTranslation';
import {Container, Row, Col} from "react-bootstrap";
import Banner from "../../../components/banner/banner";
import eventsData from '../../../data/events.json';
import classes from './index.module.css';

const events = () => {
  const { t } = useTranslation();

  return (
      <Layout>
        <Banner caption={'events-page-caption'}/>
        <Container>
          <Row>
            <Col md={12}>
              <h1 className={classes.eventsHeader}>
                {t('events-page-caption')}
              </h1>
              {eventsData.map(event => (
                      <div key={event.title}>
                        <h3>
                          {event.title}
                        </h3>
                        <ul className='list-unstyled'>
                          <li>
                            <strong>
                              {t('events-date-title')}
                            </strong>
                            {event.date}
                          </li>
                          <li>
                            <strong>
                              {t('events-location-title')}
                            </strong>
                            {event.location}
                          </li>
                          <li>
                            <strong>
                              {t('events-booth-title')}
                            </strong>
                            {event.booth}
                          </li>
                          <li>
                            <strong>
                              {t('events-venue-title')}
                            </strong>
                            {event.venue}
                          </li>
                          <li>
                            <a href={event.website} target="_blank">
                              {t('events-website-title')}
                            </a>
                          </li>
                        </ul>
                      </div>
                  )
              )}
            </Col>
          </Row>
        </Container>
      </Layout>
  );
};

events.getInitialProps = async () => {
  return {};
};

export default withLocale(events);
