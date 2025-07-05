Component({
  methods: {
    emitInput(e) {
      this.triggerEvent('input', e.detail);
    },
  },
});
