import { Divider, List, ListItem, ListItemText } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"


const NoItem = () => (<ListItem divider><ListItemText primary="no item" primaryTypographyProps={{color:"textSecondary"}}/></ListItem>)
const Loading = () => (<ListItem divider><ListItemText primary={<Skeleton width={`50%`} />} /></ListItem>) 

export const ListDocs = ({ fetched, docs, component, ...props }) => {
  return (<List>
    <Divider />
    {
      fetched
        ? ( docs.length ? docs.map((doc,index)=>component(doc,index)) : <NoItem /> )
        : <Loading />
    }
  </List>)
}