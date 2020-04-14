import { Component, OnInit, OnChanges, OnDestroy, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import Tabulator from 'tabulator-tables';
import { TabulatorConfigs } from './tabulatorConfigs';
import { Subject } from 'rxjs';
import { AjaxConfigs } from './ajaxConfigs';

@Component({
  selector: 'app-tabulator',
  templateUrl: './tabulator.component.html',
  styleUrls: ['./tabulator.component.scss']
})
export class TabulatorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  // Inputs
  @Input() columnNames: Array<any>;
  @Input() tableConfigs: TabulatorConfigs;
  @Input() additionalTableConfigs: Object;
  @Input() resultCount: number;

  // Subject for destroying the component when navigating away from the page with the component.
  componentDestroyed$: Subject<boolean> = new Subject();

  public myTable: Tabulator;

  /*
    Set of predefined Tabulator properties to help keep all tables uniform.
    These properties can be over-written with anything that you provide in the additionalTableConfigs input.

    Feel free to modify this object as needed to keep your tables looking the way you want!

    Notice: These properties are defined as the options that Tabulator allows.
    Please see the Tabulator Documentation to review what you can add here:
    http://tabulator.info/docs/4.6/options

    This over-writting happens below in the this.setDynamicTableProperties() function.
  */

  public dynamicTableProperties: Object = {
    ajaxLoaderLoading: '',
    placeholder: 'No Data Available',
    height: 100,
    layout: 'fitColumns',
    columnMinWidth: 60,
    paginationSize: 100,
    paginationSizeSelector: [100, 250, 500],
    ajaxRequesting: (url, params) => {
      // Set any default universal params here
      if (this.additionalTableConfigs['ajaxParams']) {
        for (const property of Object.keys(this.additionalTableConfigs['ajaxParams'])) {
          params[property] = this.additionalTableConfigs['ajaxParams'][property];
        }
      }
    },
    ajaxResponse: (url, params, responseData) => {
      /*
        When we get a response from a remote API call, check if there is additionalTableConfigs.
        If there are additionalTableConfigs then check for a paginationDataReceived property.

        Tabulator is expecting the property to be called 'data' but you may have named it something else in the response.
      */
      if (this.additionalTableConfigs.hasOwnProperty('paginationDataReceived')) {
        const dataName = this.additionalTableConfigs['paginationDataReceived']['data'];
        // Check if the response data is empty
        if (responseData[dataName] === null) {
          // If the data is empty then clear the table
          this.myTable.clearData();
        } else {
          /*
            Grab the result count to place in the footer of Tabulator
            We're assuming the property in responseData is called resultCount.
            You can rename this property as needed.
          */
          this.resultCount = responseData['resultCount'];
          return responseData;
        }
      } else {
        /*
          If there is no additionalTableConfigs then assume the responseData is in the format Tabulator expects.
        */
        if (responseData.data === null) {
          this.myTable.clearData();
        } else {
          return responseData;
        }
      }
    },
    ajaxError: (error) => {
      const errorTitle = 'Tabulator Error';
      let errorMessage = 'An Error Has Occured';
      if (error && error.status && error.statusText) {
        errorMessage = `${error.status}: ${error}`;
      }
      // Do what you want with the error here. For now we'll console.log it
      console.log(`${errorTitle}: ${errorMessage}`);
      // Then clear the table
      this.myTable.clearData();
    },
    dataLoaded: () => {
      // Set the total result count in the footer
      this.setFooterResultsCount(this.resultCount);
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

  /*
    We wait for the view to initialize so the div in tabulator.component.html is ready for the table.
  */
  ngAfterViewInit(): void {
    this.initTable();
  }

  /*
    Here we check for changes on the inputs.
    This is helpful if you have a table that might need change structure or API calls based on user interaction.
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.myTable) {
      // If there is no table yet just return
      return;
    }
    if (changes.columnNames && changes.columnNames.currentValue !== changes.columnNames.previousValue) {
      // If the columnNames in changes are not the same then update the table with the new columnNames
      this.myTable.setColumns(this.columnNames);
    }
    // Update the table with any new data or API url
    this.myTable.setData(this.tableConfigs.data);
  }

  private initTable(): void {
    /*
      Dynamically build the properties needed for Tabulator based the defaults above plus what ever is provided in additionalTableConfigs
    */
    this.setDynamicTableProperties();
    /*
      Create a Tabulator table with the provided tableId from the tableConfigs Input
      Provide the dynamicTablesProperties now that they have been combined with additionalTableConfigs
    */
    this.myTable = new Tabulator(
      `#${this.tableConfigs.tableId}`,
      this.dynamicTableProperties
    );
  }

  private setDynamicTableProperties(): void {
    // Add the coulmns from columnNames Input
    this.dynamicTableProperties['columns'] = this.columnNames;

    if (this.tableConfigs.isRemotePagination) {
      // If this is a remote pagination table
      this.dynamicTableProperties['pagination'] = 'remote';
      this.dynamicTableProperties['ajaxURL'] = this.tableConfigs.data;
      /*
        Setup default ajaxConfigs. These are outlined in the Tabulator Documentation:
        http://tabulator.info/docs/4.6/data#ajax-advanced
      */
     this.dynamicTableProperties['ajaxConfig'] = this.setAjaxConfigs();

    } else {
      // If isRemotePagination is false then we assume this will be local pagination
      this.dynamicTableProperties['pagination'] = 'local';
      this.dynamicTableProperties['data'] = this.tableConfigs.data;
    }

    // If there are additionalTableConfigs then assign them to the dynamicTableProperties Object
    if (this.additionalTableConfigs) {
      for (const property in this.additionalTableConfigs) {
        if (property !== 'ajaxParams') {
          /*
            Add any additional configs to the table except ajaxParams. These will be added in the ajaxRequesting callback
          */
          this.dynamicTableProperties[property] = this.additionalTableConfigs[property];
        }
      }
    }
  }

  // Set Default AjaxConfigs
  private setAjaxConfigs(): AjaxConfigs {
    const ajaxConfigs: AjaxConfigs = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
        // Add Authorization here if you need it
      }
    };
    return ajaxConfigs;
  }

  private setFooterResultsCount(count: number): void {
    if (count === undefined) {
      return;
    }
    const tableElement = document.getElementById(this.tableConfigs.tableId);
    if (tableElement) {
      const footerElement = tableElement.querySelector('.tabulator-footer');
      // If there is already a result-count span then update the number inside
      if (footerElement.querySelector('#result-count')) {
        const resultCountId = footerElement.querySelector('#result-count');
        resultCountId.textContent = `${count}`;
      } else {
        // If result-count does not exist yet then make it
        footerElement.insertAdjacentHTML('beforeend', `<span class='result-count ml-2'>Total Results: <span id='result-count'>${count}</span></span>`);
      }
    }
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

}
