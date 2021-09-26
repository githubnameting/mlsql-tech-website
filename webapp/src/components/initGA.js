import ReactGA from 'react-ga';

export const initGA = () => {
  console.log('init')
  ReactGA.initialize(
    [
      {
        trackingId: 'UA-000000-01',
        gaOptions: {
          name: 'tracker1',
          userId: 123
        }
      },
      {
        trackingId: 'UA-000000-01',
        gaOptions: { name: 'tracker2' }
      }
    ],
    { debug: true, alwaysSendToDefaultTracker: false }
  );
  ReactGA.pageview(window.location.pathname + window.location.search, ['tracker2']);
  // ReactGA.event({
  //   category: 'Button',
  //   action: 'Click',
  //   label: 'Free Trail'
  // });
  // console.log(ReactGA.event, 'event')
  // ReactGA.event({
  //   category: 'Button',
  //   action: 'Click',
  //   label: '立即试用'
  // });
  // ReactGA.event({
  //   category: 'Button',
  //   action: 'Click',
  //   label: '创建账号'
  // });
}