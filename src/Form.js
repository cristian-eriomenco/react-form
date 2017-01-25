import React from 'react';

class ExampleForm extends React.Component {
  constructor() {
    super();
    this.state = {
      touched: {},
      values: {},
      validators: {},
      nameRequired: false
    };
  }

  handleChange(e){
    this.setState({
      values: { ...this.state.values, [e.target.name]: e.target.value }
    });
  }

  handleBlur(e){
    this.setState({
      touched: { ...this.state.touched, [e.target.name]: true },
    });
  }

  registerValidator(field, validator) {
    const nextState = { ...this.state };
    nextState.validators[field] = validator;
    this.setState(nextState);
  }

  getErrors() {
    let errors = {};
    for (let key in this.state.validators) {
      let rules = this.state.validators[key];
      rules.forEach(rule => {
        errors[key] = rule(this.state[key])
      })
    }
    return errors;
  }

  toggleRequired() {
    this.setState({
      ...this.state,
      nameRequired: !this.state.nameRequired,
    })
  }

  render() {
    let errors = this.getErrors();

    return (
      <form onSubmit={this.handleSubmit} style={{width:500}}>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
        <Field
          name="email"
          validator={[email()]}
          registerValidator={this.registerValidator.bind(this)}
          type="text"
          placeholder="Enter email"
          value={this.state.email}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          />
        <Field
          name="name"
          required={this.state.nameRequired}
          className={this.state.nameRequired ? "error" : ""}
          registerValidator={this.registerValidator.bind(this)}
          type="text"
          placeholder="Enter name"
          value={this.state.name}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          />
        <button onClick={this.toggleRequired.bind(this)} type="button">Name Required: {`${this.state.nameRequired}`}</button>
      </form>
    )
  }
}

class Field extends React.Component {
  componentWillMount() {
    this.handleValidatorRegistration(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.required !== nextProps.required) {
      this.handleValidatorRegistration(nextProps);
    }
  }
  handleValidatorRegistration(nextProps) {
    const validators = this.getValidators(nextProps);
    nextProps.registerValidator(nextProps.name, validators);
  }
  getValidators(nextProps) {
    let validators = [];
    if (nextProps.required) {
      validators = validators.concat(required(nextProps.name))
    }
    if (nextProps.validator) {
      validators = validators.concat(nextProps.validator);
    }
    return validators;
  }

  render() {
    return (<input {...this.props} />)
  }
}

const required = (fieldName) => {
  return (value) => {
    if (!value || value.length < 1) {
      return `Field ${fieldName} is required`
    }
  };
}

const email = () => {
  return (value) => {
    if (!/^\S+\@\S+\.\S+$/i.test(value)) {
      return "Invalid email address";
    }
  };
}
export default ExampleForm;