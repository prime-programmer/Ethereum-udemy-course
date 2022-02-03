import React, { Component } from 'react'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'
import { Input, Form, Button, Message } from 'semantic-ui-react'
import Layout from '../../../components/Layout'
import { Link, Router } from '../../../routes'

export class NewRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
    description: '',
    value: '',
    recipient: '',
    loading: false,
    errorMessage: ''
  }
  this.onSubmit = this.onSubmit.bind(this);
}
  static async getInitialProps(props) {
    return { address: props.query.address }
  }

  async onSubmit(event) {
    event.preventDefault()
    
    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: '' })
    
    try {
        const accounts = await web3.eth.getAccounts();
      await campaign.methods
      .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
      .send({
        from: accounts[0]
      });   
    
    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
       <Link route={`/campaigns/${this.props.address}/requests`}>
           <a>
               Back
           </a>
       </Link>
        <h3>Request Form</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event => this.setState({description:event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({value:event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event=>this.setState({recipient:event.target.value})}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage}/>
          <Button primary loading={this.state.loading}>Create Request</Button>
        </Form>
      </Layout>
    )
  }
}

export default NewRequest