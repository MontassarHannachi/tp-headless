export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-messages/submit',
      handler: 'api::contact-message.contact-message.submit',
      config: {
        auth: false,
      },
    },
  ],
};
