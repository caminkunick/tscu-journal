import React from 'react';
import "./material.css";
import moment from 'moment';

import {
  Inject,
  ScheduleComponent,
  Day,
  Month,
  ViewsDirective,
  ViewDirective,
} from "@syncfusion/ej2-react-schedule";

import { L10n } from '@syncfusion/ej2-base';
import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/pro-solid-svg-icons';

const Calendar = ({ data, ...props }) => {

  L10n.load({
    'en-US': {
        'schedule': {
            'saveButton': 'Test edit',
            'cancelButton': 'Close',
            'deleteButton': 'Remove',
            'newEvent': 'afkosajfosj',
        },
    }
  });

  const editorWindowTemplate = () => {
    return (
      <table className="custom-event-editor">
        <tbody>
          <tr>
            <td className="e-textlabel">
              <p>Thai</p>
              <p>English</p>
            </td>
            <td className="e-textlabel">
              <p>Thai</p>
              <p>English</p>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">
              <h3>Title</h3>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const handlePopupOpen = (args) => {
    if(args.data.Id){
      args.element.getElementsByClassName('e-edit')[0].remove();
      args.element.getElementsByClassName('e-delete')[0].remove();
    } else if(args.data.event && args.data.event.length>0){
    } else {
      args.cancel = true;
    }
  }

  const quickInfoFooter = args => {
    if(args.elementType==="event"){
      return (<div className="e-cell-content">
        <Typography variant="h6" color="textSecondary" paragraph>
          <FontAwesomeIcon icon={faClock} />
          &nbsp;
          { moment(args.StartTime).format('LL') }
        </Typography>
        <Button variant="contained" color="primary" component={Link} to={`/${args.data.jid}/admin/s/${args.data.parent}/r/${args.data.id}`} target="_blank">Open Submission</Button>
      </div>)
    }
    return (null)
  }
  const handleEventRendered = args => {
    const isLate = Date.now() > (new Date(args.data.StartTime));
    if(isLate){
      args.element.style.backgroundColor = '#e3165b';
    }
  }


  return (
    <ScheduleComponent
      currentView="Month"
      selectedDate={props.selectDate || Date.now()}
      eventSettings={{ dataSource: data || [] }}
      editorTemplate={editorWindowTemplate}
      popupOpen={handlePopupOpen}
      quickInfoTemplates={{ content: quickInfoFooter.bind(this) }}
      eventRendered={handleEventRendered.bind(this)}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Month" />
      </ViewsDirective>
      <Inject services={[Day, Month]} />
    </ScheduleComponent>
  );
}

export default Calendar;