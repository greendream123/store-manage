export default [
  { icon: "home", index: "/dashboard", title: "dashboard" },
  { icon: 'storage', index: '1', title: 'storage',
    children: [
      { icon: 'repertory', index: '/repertory', title: 'allProduct' },
      { icon: 'drink', index: '/drinks', title: 'drinks' },
      { icon: 'food', index: '/foods', title: 'foods' },
      { icon: 'commodity', index: '/commodity', title: 'commodity' },
    ]
  },
  {
    icon: 'chart', index: '2', title: 'saleOverview',
    children: [
      { icon: 'sale', index: '/salechart', title: 'saleChart' },
      { icon: 'profit', index: '/profitchart', title: 'profitChart' },
      { icon: 'yeartrend', index: '/yearchart', title: 'yearChart' },
    ]
  },
  {
    icon: 'log', index: '3', title: 'logRecord',
    children: [
      { icon: 'salelog', index: '/salelog', title: 'saleLog' },
      { icon: 'purchaselog', index: '/purchaseLog', title: 'purchaseLog' },
    ]
  },
  { icon: 'account', index: '/account', title: 'accountManage'}
]