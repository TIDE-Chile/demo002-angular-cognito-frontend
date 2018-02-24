import { Injectable } from '@angular/core';
//import * as _ from "lodash;

@Injectable()
export class FlexiDataService {

  dataDistribution = {
    ageGroup : {
      '0to20' : 0.25,
      '20to60' : 0.6,
      'over60' : 0.15
    },

    income: {
      low: 0.4,
      med: 0.3,
      high: 0.3
    }
  }

  _data = [];
  numberOfPoints = 1000;

  constructor() { }

  buildData() {
    for (let i =0; i < this.numberOfPoints; i++ ) {
      this._data.push({});
    }

  }

  getDataBy(type) {
    const distribution:{} = this.dataDistribution[type];

    const keys = Object.keys(distribution);

    const distributionHelper = [];
  
  }



}
