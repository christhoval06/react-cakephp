export default [{
  roles: ['admin', 'user'],
  label: 'app.sidebar.menu.console',
  path: '/console',
  icon: 'stats'
}/*,{
  roles: ['admin', 'user'],
  label: 'app.sidebar.menu.campaign',
  path: '/campaign/grid',
  icon: 'dashboard'
}, {
  roles: ['admin', 'user'],
  label: 'app.sidebar.menu.logs',
  path: '/campaign-log/grid',
  icon: 'time'
}, {
  roles: ['admin', 'user'],
  label: 'app.sidebar.menu.subscription_payment',
  path: '/subscription-payment/grid',
  icon: 'euro'
},{
  roles: ['admin', 'user'],
  label: 'app.sidebar.menu.subscription_package',
  path: '/subscription-package/grid',
  icon: 'gift'
} */, {
  roles: ['admin'],
  label: 'app.sidebar.menu.deal',
  path: '/deal/grid',
  icon: 'dashboard'
},{
  roles: ['admin'],
  label: 'app.sidebar.menu.deal_category',
  path: '/deal-category/grid',
  icon: 'gift'
},/*, {
  allow: (user) => user.reseller,
  roles: [],
  label: 'app.sidebar.menu.reseller',
  path: '/user-lead/grid',
  icon: 'briefcase'
}*/, {
  roles: ['admin'],
  label: 'app.sidebar.menu.config',
  path: '/config',
  icon: 'cog'
}, {
  roles: ['admin'],
  label: 'app.sidebar.menu.users',
  path: '/user/grid',
  icon: 'user'
}]
