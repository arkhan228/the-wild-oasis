const styles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: state.isDisabled
      ? 'var(--color-grey-200)'
      : 'var(--color-grey-0)',
    cursor: state.isDisabled ? 'not-allowed' : 'default',
    pointerEvents: state.isDisabled && 'all',
    borderColor: 'var(--color-grey-300)',
    borderRadius: 'var(--border-radius-sm)',
    minHeight: '3.8rem',
    transition: 'all 0s',
    outline: state.isFocused && '2px solid var(--color-brand-600) !important',
    outlineOffset: '-1px',
    ':hover': {
      borderColor: 'var(--color-grey-300)',
    },
  }),
  indicatorsContainer: base => ({
    ...base,
    '& div': {
      padding: '0.4rem',
    },
  }),
  menu: base => ({
    ...base,
    background: 'var(--color-grey-0)',
    scrollbarColor: 'var(--color-grey-500) var(--color-grey-0)',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? 'var(--color-brand-600)'
      : 'var(--color-grey-0)',
    color: state.isSelected
      ? 'var(--color-grey-0)'
      : state.isDisabled
      ? 'var(--color-grey-400)'
      : 'var(--color-grey-700)',
    ':hover': {
      background: state.isDisabled || 'var(--color-grey-300)',
    },
  }),
  singleValue: base => ({
    ...base,
    color: 'var(--color-grey-700)',
  }),
};

export default styles;
