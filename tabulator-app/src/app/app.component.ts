import { Component, OnInit } from '@angular/core';
import { TabulatorConfigs } from './tabulator/tabulatorConfigs';
import { MtgService } from './ExampleServices/mtg.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tabulator-app';

  /*
    Local Pagination Tabulator properties
    - Because this is local we will provide the result count
    - We also need to provide the data.
    - I'm going to assign the data to a property but you could also provide it from a subscription
      or anywhere else depending on your workflow.
  */
  public exampleLocalColumnNames: Array<any>;
  public exampleLocalTableConfigs: TabulatorConfigs;
  public exampleLocalAdditionalTableConfigs: Object;
  public exampleLocalResultCount: number;
  public exampleLocalData: Array<any>;


  // Remote Pagination Tabulator properties - Remote Pagination should provide the result count in the responseData
  public exampleRemoteColumnNames: Array<any>;
  public exampleRemoteTableConfigs: TabulatorConfigs;
  public exampleRemoteAdditionalTableConfigs: Object;

  // These properties are just for this example
  public selectedCard;

  constructor(
    private mtgService: MtgService
  ) { }

  ngOnInit(): void {
    this.initTables();
  }

  /*
    Breaking each table down into multiple functions helps me stay organized.
    The key here is to fill in your properties listed above: columnNames, tableConfigs, additionalTableConfigs
  */
  private initTables(): void {
    this.initLocalTable();
    this.initRemoteTable();
  }

  private initLocalTable(): void {
    this.setLocalColumnNames();
    this.setLocalTableConfigs();
    this.setLocalAdditionalTableConfigs();
  }

  private initRemoteTable(): void {
    this.setRemoteColumnNames();
    this.setRemoteTableConfigs();
    this.setRemoteAdditionalTableConfigs();
  }

  private setLocalColumnNames(): void {
    /*
      Define the columns you need based on the Tabulator documentation and your data
      http://tabulator.info/docs/4.6/columns
    */
    this.exampleLocalColumnNames = [
      {
        title: 'Name',
        field: 'name',
        headerFilter: true,
        headerFilterPlaceholder: 'Name...'
      },
      {
        title: 'Cost',
        field: 'cmc',
        hozAlign: 'left',
        formatter: 'progress',
        formatterParams: {
          min: 0,
          max: 10,
        },
        width: 150
      },
      {
        title: 'Mana',
        field: 'mana_cost',
        hozAlign: 'left',
        formatterParams: {
          height: '50px',
          width: '50px',
        },
        formatter: (cell, formatterParams, onRendered) => this.manaImages(cell, formatterParams, onRendered),
        width: 150
      },
      {
        title: 'Type',
        field: 'type_line',
        headerFilter: true,
        headerFilterPlaceholder: 'Type...'
      },
      {
        title: 'Rarity',
        field: 'rarity',
        width: 150
      },
      {
        title: 'Set',
        field: 'set_name',
        width: 150
      },
    ];
  }

  private setLocalTableConfigs(): void {
    /*
      REQUIRED
      These configs are needed by default by Tabulator
      This is a LOCAL table we need to have the data ahead of time.
      isRemotePagination is false, this tells the Tabulator Component to use the data we supply
      See: Tabulator.Component.ts Line 156
    */
    this.mtgService.getLocalMTGCards().subscribe(response => {
      console.log('mtg response: ', response);
      this.exampleLocalData = response.data;
      this.exampleLocalResultCount = this.exampleLocalData.length;

      this.exampleLocalTableConfigs = {
        tableId: 'example-local-table',
        isRemotePagination: false,
        data: this.exampleLocalData
      };
    });
  }

  private setLocalAdditionalTableConfigs(): void {
    /*
      Define any specific Configurations you need for your table based on Tabulators Documentation
      Examples:
        Styling - http://tabulator.info/docs/4.6/layout
        Callbacks - http://tabulator.info/docs/4.6/callbacks
        PaginationDataReceived - http://tabulator.info/docs/4.6/page#remote-response
        Initial Sorting - http://tabulator.info/docs/4.6/sort#intial
        ETC.
    */
    this.exampleLocalAdditionalTableConfigs = {
      height: 350,
      paginationSize: 10,
      paginationSizeSelector: [10, 50, 100],
      initialSort: [
        { column: 'rarity', dir: 'desc' }
      ],
      rowClick: (e, row) => this.exampleLocalRowClick(e, row)
    };
  };

  private exampleLocalRowClick(e, row): void {
    const rowData = row.getData();
    this.selectedCard = rowData;
    console.log('this.selectedCard: ', this.selectedCard);
  }

  private manaImages(cell, formatterParams, onRendered) {
    const cellData = cell.getData();
    const manaSymbolArray = cellData['mana_cost'].split('}');
    console.log('manaSymbolArray: ', manaSymbolArray);
    console.log('mana images cell: ', cell.getData()['mana_cost']);
    console.log('mana images formatterParams: ', formatterParams);
    console.log('mana images onRendered: ', onRendered);
  }

  public clearCard(): void {
    this.selectedCard = null;
  }
}
