/* eslint global-require: 0 */
module.exports = {
  routes: [
    {
      path: '/',
      redirect: '/welcome',
      name: 'side-bar',
      component: require('@/layout/side-bar/').default,
      children: [
        {
          path: '/welcome',
          name: 'welcome-page',
          component: require('@/pages/welcome/').default,
        },
        {
          path: '/contributing',
          name: 'contributing',
          component: require('@/pages/contributing/').default,
        },
      ],
    },
    {
      path: '/full-page/:id',
      name: 'full-page',
      component: require('@/layout/full-page/').default,
      children: [],
    },
  ],
};
