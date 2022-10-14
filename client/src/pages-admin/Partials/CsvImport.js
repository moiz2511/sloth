import React from "react";
import {Button} from "shards-react";
import {CSVLink} from "react-csv";

const CsvImport=(props)=>{
    return(
        <CSVLink
            data={props.csvData}
            asyncOnClick={true}
            target="_blank"
            filename={props.filename}
        >
            <Button squared theme="secondary" className={"export-btn"}>
                Export
            </Button>
        </CSVLink>
    );
}

export default CsvImport;