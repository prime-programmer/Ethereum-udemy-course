
import React, { Component } from 'react'
import { Button, Form, Input, Grid, Message } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import { Router } from '../../routes'

class New extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
      }
    this.onSubmit = this.onSubmit.bind(this);
  }

    async onSubmit (event)  {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts()
    this.setState({ loading: true, errorMessage: '' })
    
    try {
      await factory.methods.createCampaign(this.state.minimumContribution).send({
        from: accounts[0]
      });

      Router.pushRoute('/');
    } catch (error) {
      this.setState({ errorMessage: error.message })
    }
    this.setState({ loading: false })
  }

  render() {
    const { errorMessage, loading } = this.state
    return (
      <Layout>
        <Grid centered columns={2}>
          <Grid.Column>
            <h3>Create a Campaign.</h3>
            <Form onSubmit={this.onSubmit} error={!!errorMessage}>
              <Form.Field>
                <lable>Minimum Contribution </lable>
                <Input
                  label="WEI"
                  labelPosition="right"
                  value={this.state.minimumContribution}
                  onChange={event=>this.setState({minimumContribution:event.target.value})}
                />
              </Form.Field>
              <Message error header="Oops!" content={errorMessage}/>
              <Button loading={loading} primary>Create</Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Layout>
    )
  }
}

export default New
