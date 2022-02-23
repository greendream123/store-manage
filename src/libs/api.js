export default {
  whoami: { url: '/whoami', method: 'GET' }, // 获取当前登录账户信息
  adminLogout: { url: '/auth/logout', method: 'POST' }, // 管理员注销

  adminLogin: { url: '/login', method: 'POST' }, // 管理员登录
  getProductCount: { url: '/productCount', method: 'GET' }, // 获取商品种类数量
  getProducts: { url: '/products', method: 'GET' }, // 根据分页查询商品
  addProducts: { url: '/addProduct', method: 'POST' }, // 添加新商品
  editProducts: { url: '/editProduct', method: 'POST' }, // 修改商品信息
  delProducts: { url: '/delProduct', method: 'POST' }, // 删除商品 code
  getAccounts: { url: '/accounts', method: 'GET' }, // 获取所有用户信息
  addAccount: { url: '/addAccount', method: 'POST' },
  editAccount: { url: '/editAccount', method: 'POST' },
  delAccount: { url: '/delAccount', method: 'POST' },

  getSaleInfos: { url: '/saleInfos', method: 'GET' }, // 获取销售记录
  getYearSale: { url: '/yearSale', method: 'GET' }, // 获取年销售额
  getSaleYears: { url: '/years', method: 'GET' }, // 获取有销售记录的年份
  getSaleLogCount: { url: '/saleLogCount', method: 'GET' }, // 获取销售日志数量
  getSaleLogs: { url: '/saleLogs', method: 'GET' }, // 获取销售日志数量
}
