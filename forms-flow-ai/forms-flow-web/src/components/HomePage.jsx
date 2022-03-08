import React, {useEffect} from 'react'
import UserService from '../services/UserService'
import NavBar from "../containers/NavBar";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

const HomePage =({store})=>{

    useEffect(()=>{
        UserService.authenticateAnonymousUser(store)
    },[store])
    return (
          <div className="container">
                <NavBar/>
                <section>
                    <div className="home" style={{ width: '60vw', marginLeft: 'auto', marginRight: 'auto', padding: '3rem' }}>
                        <h3>Serve Legal Documents</h3>
                        Description...
                        <Card style={{ width: '60vw', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem', padding: '1rem' }}>
                            <Card.Body>
                                <Card.Text>
                                    This real-time information is provided as a service to general public. Any user of this information is hereby 
                                    advised that it is being provided "as is". The information provided may be subject to errors or omissions.
                                    <br /><br />
                                    <Link to="/public/form/621e846630026eb68d5b2005" className="btn btn-primary">Access Legal Documents Service</Link>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </section>
          </div>
       )
}

export default HomePage;
