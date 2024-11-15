import { Box, Button, TextField } from "@material-ui/core";
import { Container, ContentHeader, MainContainer } from "@piui";
import { auth } from "Modules/firebase";
import { useState } from "react";

const PagePasswordReset = props => {
  const [email,setEmail] = useState("");

  const handleSendEmail = () => {
    auth.sendPasswordResetEmail(email)
    .then(()=>{
      alert("Send success.\nPlease check your mail box.")
    })
    .catch(error=>{
      console.log(error)
      alert(error.message);
    })
  }

  return (<MainContainer>
    <Container maxWidth="sm">
      <ContentHeader
        label="Forget Password"
        breadcrumbs={[
          { label: 'Home', to: '/' },
        ]}
      />
      <TextField
        fullWidth
        label="E-mail"
        variant="outlined"
        onChange={e=>setEmail(e.target.value)}
      />
      <Box mb={2} />
      <Button variant="outlined" color="primary" onClick={handleSendEmail} disabled={!email}>Send Email</Button>
    </Container>
  </MainContainer>)
}

export default PagePasswordReset;