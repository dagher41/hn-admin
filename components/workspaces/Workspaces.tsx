import { Fragment, useState, useEffect } from "react";
import {
  List as RAList,
  Datagrid,
  Show,
  SimpleShowLayout,
  TextField,
  Button,
  useUpdate,
} from "react-admin";
import List from "@mui/material/List";
import ListItem from '@mui/material/ListItem';
import FolderIcon from '@mui/icons-material/Folder';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const PostComponent = ({ message, onDelete }) => {
  const [handleDelete, { loading }] = useUpdate(
    "messages",
    message.id,
    { deletedAt: new Date(), deletedByUserId: localStorage.getItem("userUid") },
    message,
    {
      onSuccess: () => onDelete(message)
    }
  );
  return (
    <Fragment>
      <List
        sx={{ width: "100%", bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItem>
          <ListItemIcon>
            {(() => {
                if(message.isFlagged) {
                  return <FlagRoundedIcon label="Flagged" sx={{ mr: 2 }} color="error"/>
                } else {
                  return <FolderIcon />
                }
              })()}
          </ListItemIcon>
          <ListItemText primary={message.body} secondary={`${message.user.lastName}, ${message.user.firstName}`} />
          <ListItemText>
          </ListItemText>
          <IconButton edge="end" aria-label="delete" onClick={handleDelete} disabled={loading}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </List>
    </Fragment>
  );
};

const HNWorkspaceShow = ({ record: workspace }) => {
  const [messages, updateMessages] = useState(workspace.messages);
  useEffect(() => { updateMessages(workspace.messages)}, [workspace.messages] )
  
  const onDelete = (message) => {
    updateMessages(messages.filter((p) => p.id != message.id));
  };

  return (
    <Fragment>
      <h4> Messages Under Workspace </h4>
      {workspace &&
        messages &&
        messages.map(message => {
          return (
            <PostComponent key={message.id} message={message} onDelete={onDelete} />
          );
        })}
    </Fragment>
  );
};

export const WorkspacesList = (props) => (
  <RAList {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
    </Datagrid>
  </RAList>
);

export const WorkspaceShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
        <HNWorkspaceShow />
      </SimpleShowLayout>
    </Show>
  );
};
