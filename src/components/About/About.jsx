import React from 'react'
import {
    Container,
    Row
} from 'reactstrap'

export default class About extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <h1 style={{ margin: '0 auto' }}>General Use</h1>
                    <p style={{ fontSize: '16px' }}>
                        On the front page, you'll see a list of Challenges, sorted from newest to oldest. Each Challenge has flags that you earn points for solving. 
                        Easier flags are worth fewer points, and more difficult flags are worth more points. Each flag has hints that you can purchase, if you need help, 
                        using your earned points. 
                        <br />
                        <br />
                        For most Challenges, the creator will have left a detailed enough description for you to get started. You can download relevent 
                        files using the download button in the top right of the Challenge page. Many times this may be a virtual machine running 
                        some vulnerable software that you're tasked with exploiting.
                    </p>
                    <h1 style={{ margin: '0 auto' }}>Creation Guidelines</h1>
                    <p style={{ fontSize: '16px' }}>
                        Thanks for choosing to contribute to this platform! In case you need to know how to contribute, click "Create" on the home page.
                        A form will show up, and you can give your Challenge a name, description (with markdown formatting), assign it a category and difficulty,
                        create tags (press "enter" to add a typed flag), and you can also upload any files needed for your challenge!
                        <br />
                        <br />
                        In order to ensure that the quality of the content posted here isn't terrible, it'd be awesome if you could try to follow these creation guidelines.
                    </p>
                    <ul style={{ fontSize: '16px' }}>
                        <li>
                            Make sure that your Challenges are being put into the correct category. 
                            If you feel like there isn't a category for your Challenge, talk to the maintainer of this project.
                        </li>
                        <li>
                            Put thought into the description of your Challenge. Make sure you give appropriate information for its difficulty 
                            without giving away too much!
                        </li>
                        <li>
                            Challenges can be marked as "Easy", "Intermediate", or "Hard", though I'll eventually move this difficulty rating to be flag-focused.
                            This is just an estimate, and should probably be the same as the difficulty of the easiest flag of your Challenge.
                        </li>
                        <li>
                            Try not to give away too many or too few points for each flag.
                            For now, a good guideline is 0-30 points for easy flags, 30-100 points for intermediate flags, and 100-250 points for hard flags.
                        </li>
                        <li>
                            It's okay to post content created or inspired by someone else, just make sure you credit them.
                        </li>
                    </ul>
                </Row>
            </Container>
        );
    }
}