import React, { useState, useEffect } from "react";
import { Form, FormGroup, Col, Input, Label} from "reactstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

// search compoents, list of countries, dropdown of poulated radius
// and search button that sends this data via JSON
export default function SearchBar(props) {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");  

  const [innerSelect, setInnerSelect] = useState("");

  const [countryData, setCountryData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { headerName: "Country", field: "country", sortable: true, filter: true, 
    filterParams: { filterOptions:['contains','startsWith','endsWith'] }}
  ];

  useEffect(() => {
    fetch("http://sefdb02.qut.edu.au:3001/countries")
    .then(res => res.json())
    .then(data => 
      data.map(country_name =>{
        return {
          country: country_name
        };
      }))
      .then(countries => setCountryData(countries))
  }, []);


  return (
    <div>
      <p>
        Country: 
      </p>
            <div
        className="ag-theme-balham"
        style={{
          height: "350px",
          width: "300px"
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={countryData}
          pagination = {true}
          paginationPageSize = {10}
          onRowClicked = {(row) => navigate(`/list?country=${row.data.country}`)}
        />
      </div>
      <div className="Dropdown">        
        <Form>
          <FormGroup row>
            <Label
              for="exampleSelect"
            >
              Populated Radius:
            </Label>
            <Col sm={2}>
              <Input
                id="select"
                name="select"
                type="select"
                value={innerSelect}
                onChange={(event) => setInnerSelect(event.target.value)}
              >
                <option value="">
                  -
                </option>
                <option>
                  5km
                </option>
                <option>
                  10km
                </option>
                <option>
                  30km
                </option>
                <option>
                  100km
                </option>
              </Input>
            </Col>
          </FormGroup>
          </Form>
      </div>
      <button
        className="search-button"
        id="search-button"
        type="button"
        onClick={() => props.onSubmit(JSON.stringify({country: country, radius: innerSelect}))}
      >
        Search
      </button>
    </div>
  );
}