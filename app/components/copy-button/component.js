import CopyButton from 'ember-cli-clipboard/components/copy-button';

export default CopyButton.extend({
  attributeBindings: ['data-label', 'data-action']
})
