export default {
  routes: [
    {
      method: 'POST',
      path: '/orders/checkout',
      handler: 'api::order.order.checkout',
      config: {
        auth: false,
      },
    },
  ],
};
