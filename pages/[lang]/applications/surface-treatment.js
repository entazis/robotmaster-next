import React from 'react';
import useTranslation from "../../../hooks/useTranslation";
import withLocale from '../../../hocs/withLocale';
import Layout from '../../../components/layout/layout';
import Banner from '../../../components/banner/banner';
import classes from './index.module.css';
import {Col, Container, Row} from "react-bootstrap";
import VideoList from '../../../components/video-list/video-list';

const surface = () => {
  const { t } = useTranslation();

  return (
      <Layout>
        <Banner
            caption={t('application-page-caption')}
        />
        <Container className={classes.application}>
          <Row>
            <Col md={12}>
              <h2 id={'path'} className={classes.applicationSubtitle}>
                {t('application-surface')}
              </h2>
              <p>
                {t('app-surface-para-1')}
              </p>
              <p>
                {t('app-surface-para-2')}
              </p>
              <ul className={classes.applicationUlPushedIn}>
                <li>
                  {t('app-surface-list-1-1')}
                </li>
                <li>
                  {t('app-surface-list-1-2')}
                </li>
                <li>
                  {t('app-surface-list-1-3')}
                </li>
                <li>
                  {t('app-surface-list-1-4')}
                </li>
              </ul>
              <h3>
                {t('application-videos')}
              </h3>
              <VideoList id={'surface'}/>
            </Col>
          </Row>
        </Container>
      </Layout>
  );
};

export default withLocale(surface);