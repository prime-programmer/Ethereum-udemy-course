import React, {Component} from 'react'
import {Card, CardHeader, Grid, Button} from 'semantic-ui-react'
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign'
import web3 from "../../ethereum/web3"
import ContributeForm from '../../components/ContributeForm'
import {Link} from "../../routes"


class CampaignShow extends Component {
    static async getInitialProps(props) {
       const campaign = Campaign(props.query.address);

       const summary = await campaign.methods.getSummary().call();

       
       return {
           address: props.query.address,
           minimumContribution: summary[0],
           balance: summary[1],
           requestsCount: summary[2],
           approversCount: summary[3],
           manager: summary[4]
       };
        
    }

    renderCards() {
        const {
          minimumContribution,
          balance,
          requestsCount,
          approversCount,
          manager
        } = this.props;
    
        const items = [
            {
              header: manager,
              meta: "Address of Manager",
              description:
                "The manager created this campaign and can make requests to withdraw money.",
                style: {overflowWrap: 'break-word'}
            },
            {
              header: minimumContribution,
              meta: "Minimum Contribution in wei",
              description:
                "The minimum amount that must be contributed to the campaign to become a request approver."
            },
            {
              header: requestsCount,
              meta: "Number of Requests",
              description:
                "A request asks to withdraw money from the campaign. Requests must be approved by the majority of contributors."
            },
            {
              header: approversCount,
              meta: "Number of Contributors",
              description:
                "The number of people who have already contributed to this campaign."
            },
            {
              header: `${web3.utils.fromWei(balance, "ether")} ether`,
              meta: "Campaign Balance",
              description: "The total amount of unused contributions in the campaign."
            }
          ];
        return <Card.Group items={items} />;
      }

    render() {
        return (
            <Layout>
            <h3>Campaign Show</h3>
            <Grid>
            <Grid.Row>
                <Grid.Column width={10}>
                {this.renderCards()}
                
                </Grid.Column>

                <Grid.Column width={6}>
                    <ContributeForm address={this.props.address}/>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        <Button primary>View Requests</Button>
                    </a>
                </Link>
                </Grid.Column>
            </Grid.Row>
            </Grid>
            </Layout>
        );  
        
    }
}

export default CampaignShow;