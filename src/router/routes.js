/* eslint-disable */
// This is a generated file, do not edit it directly
module.exports = {
 routes: [ { path: '/', redirect: '/welcome', name: 'sidebar', component: require('@/layout/side-bar/').default, children: [{ path: '/welcome', name: 'welcome-page', component: require('@/pages/welcome/').default, },{ path: '/contributing', name: 'contributing', component: require('@/pages/contributing/').default, },{ path: '/tables', name: 'tables', component: require('@/pages/patterns/tables/').default, },{ path: '/icons', name: 'icons', component: require('@/pages/icons/').default, },],},{ path: '/full-page/:id', name: 'full', component: require('@/layout/full-page/').default, children: [],}, ]
};