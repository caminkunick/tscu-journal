import React from "react";
import "./App.css";

import "./calendar/material.css";

import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Schedule,
  ViewsDirective,
  ViewDirective,
} from "@syncfusion/ej2-react-schedule";

import { extend, L10n } from '@syncfusion/ej2-base';
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";



function App() {
  const localData = [
    {
      Id: 1,
      Subject: "Explosion of Betelgeuse Star",
      StartTime: new Date(2020, 9, 15, 9, 30),
      EndTime: new Date(2020, 9, 15, 11, 0),
    },
    {
      Id: 2,
      Subject: "Thule Air Crash Report",
      StartTime: new Date(2020, 9, 12, 12, 0),
      EndTime: new Date(2020, 9, 12, 14, 0),
    },
    {
      Id: 3,
      Subject: "Thule Air Crash Report 2",
      StartTime: new Date(2020, 9, 12, 15, 0),
      EndTime: new Date(2020, 9, 12, 18, 0),
    },
  ];

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

  const onPopupOpen = (args) => {
   
    if(args.data.Id){
      args.element.getElementsByClassName('e-edit')[0].remove();
      args.element.getElementsByClassName('e-delete')[0].remove();
      console.log('normal');
    } else if(args.data.event && args.data.event.length>0){
      console.log('event');
    } else {
      args.cancel = true;
      console.log('no open');
    }

    console.log(args);
  }


  return (
    <ScheduleComponent
      currentView="Month"
      selectedDate={new Date(2020, 9, 20)}
      eventSettings={{ dataSource: localData }}
      editorTemplate={editorWindowTemplate}
      popupOpen={onPopupOpen}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Month" />
      </ViewsDirective>
      <Inject services={[Day, Month]} />
    </ScheduleComponent>
  );
}

export default App;
