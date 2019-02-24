const cleanDropletTpl = {
  methods: {
    cleanDropletTpl(str) {
      return str.replace(/ ref="(.*)"/g, '');
    },
  },
};

export { cleanDropletTpl }; // eslint-disable-line
