import React, {useState, useEffect} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Search from "./pageAdditions/search";

// volcano list page
export default function List() {
  // initial volcano list of Algerian volcanoes with no radius stated (see Nav.jsx for link)
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  // must pass information as a string
  const [search, setSearch] = useState(JSON.stringify({
    country: country,
    radius: ""}));
  // convert to JSON object
  const searchObj = JSON.parse(search);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true, 
    filterParams: { filterOptions:['contains','startsWith','endsWith'] } },
    { headerName: "Region", field: "region" },
    { headerName: "Subregion", field: "subregion" }
  ];

  //API url
  const url = `http://sefdb02.qut.edu.au:3001/volcanoes?country=${searchObj.country}&populatedWithin=${searchObj.radius}`;  
  
  useEffect(() => {
    fetch(url)
    .then(res => res.json())
    .then(data => 
      data.map(volcano =>{
        return {
          id: volcano.id,
          name: volcano.name,
          region: volcano.region,
          subregion: volcano.subregion
        };
      }))
      .then(setError(null))
      .then(volcanoes => setRowData(volcanoes))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [url]);

  return (
    <div className="List">
      <h2>Volcano List</h2>
      <Search onSubmit={setSearch}/>
      <div className= "volcano-list">
        <p>Volcanoes:</p>
      <div
        className="ag-theme-balham"
        style={{
          height: "350px",
          width: "650px"
        }}
      >
        
        { loading ? <p>Loading...</p>
          : 
          <AgGridReact
            columnDefs={columns}
            rowData={rowData}
            pagination = {true}
            paginationPageSize = {10}
            onRowClicked = {(row) => navigate(`/volcano?id=${row.data.id}`)}
          />
        }
        
      </div>
      { error || (rowData.length === 0) ? 
      <div>There were no results, this could be due to:
        <ul>
        <li>
          Poor Connection
        </li>
        <li>
          Invalid or Expired Token
        </li>
        <li>
          Incorrect Country
        </li>
        <li>
          Search results returned nothing
        </li>
        </ul>
      </div> : null }
      </div>
    </div>
  );
}

