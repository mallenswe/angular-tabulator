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
      { title: 'Name', field: 'name' },
      { title: 'Mana Cost', field: 'manaCost' },
      { title: 'Type', field: 'type' },
      { title: 'Rarity', field: 'rarity' },
      { title: 'Set', field: 'setName' },
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
      this.exampleLocalData = response.cards;
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
      height: 460,
      paginationSize: 15,
      paginationSizeSelector: [15, 30, 60],
      initialSort: [
        { column: 'rarity', dir: 'desc' }
      ],
      rowClick: (e, row) => this.exampleLocalRowClick(e, row)
    };
  };

  private exampleLocalRowClick(e, row): void {
    const rowData = row.getData();
    this.selectedCard = rowData;
    console.log('this.selectedCard: ', this.selectedCard );
  }



  private setRemoteColumnNames(): void {
    /*
      Define the columns you need based on the Tabulator documentation and your data
      http://tabulator.info/docs/4.6/columns
    */
    this.exampleRemoteColumnNames = [
        { title: 'Name', field: 'name' },
        { title: 'Mana Cost', field: 'manaCost' },
        { title: 'Type', field: 'type' },
        { title: 'Rarity', field: 'rarity' },
        { title: 'Set', field: 'setName' },
    ];
  }

  private setRemoteTableConfigs(): void {
    /*
      REQUIRED
      These configs are needed by default by Tabulator
      This is a REMOTE table so we need to supply an API URL string.
      isRemotePagination is true, this tells the Tabulator Component to make a remote pagination request
      See: Tabulator.Component.ts Line 146
    */
    this.exampleRemoteTableConfigs = {
      tableId: 'example-remote-table',
      isRemotePagination: true,
      data: this.mtgService.getRemoteMTGCards()
    };
  }

  private setRemoteAdditionalTableConfigs(): void {
    /*
      Define any specific Configurations you need for your table based on Tabulators Documentation
      Examples:
        Styling - http://tabulator.info/docs/4.6/layout
        Callbacks - http://tabulator.info/docs/4.6/callbacks
        PaginationDataReceived - http://tabulator.info/docs/4.6/page#remote-response
        Initial Sorting - http://tabulator.info/docs/4.6/sort#intial
        ETC.
    */
    this.exampleRemoteAdditionalTableConfigs = {
      initialSort: [
        { column: 'name', dir: 'desc' }
      ],
      rowClick: (e, row) => this.exampleRemoteRowClick(e, row)
    };
  }

  private exampleRemoteRowClick(e, row): void {

  }


  public clearCard(): void {
    this.selectedCard = null;
  }
}
