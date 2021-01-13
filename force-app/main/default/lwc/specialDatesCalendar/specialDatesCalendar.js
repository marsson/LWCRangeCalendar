/**
 * @author Marcelo Marsson on 20/12/20.
 * @email marcelo.costa@salesforce.com
 * Open source Calendar project, based on Blogpost from Salesforce
 *
 */

import { LightningElement, api, track } from "lwc"; 
import MOMENT from "@salesforce/resourceUrl/momentJS";
import { loadScript } from "lightning/platformResourceLoader"; // to load libs

export default class SpecialDatesCalendar extends LightningElement {
  @api recordId;
  @api sObjectType;
  @track isMomentLoaded = false;
  // eslint-disable-next-line no-use-before-define
  @track calendar;
  dateNodes = [];
  currentDate;
  selectedDate;

  //Used to load our our lib
  connectedCallback() {
    if (this.isMomentLoaded) {
      return;
    }
    // first load jquery file
    loadScript(this, MOMENT + "/moment.min.js")
      .then(() => {
        //load the js files and css files
        this.isMomentLoaded = true;
      })
      .then(() => {
        this.gotoToday();
      })
      .catch((error) => {
        throw error;
      });
  }

  get year() {
    return this.currentDate ? this.currentDate.format("YYYY") : "";
  }

  get month() {
    return this.currentDate ? this.currentDate.format("MMMM") : "";
  }

  gotoNextMonth() {
    this.currentDate.add(1, "months").startOf("month");
    this.setDateNodesForCurrentDate();
  }

  gotoPrevMonth() {
    this.currentDate.subtract(1, "months").startOf("month");
    this.setDateNodesForCurrentDate();
  }

  gotoToday() {
    // eslint-disable-next-line no-undef
    this.currentDate = moment().startOf("month");
    this.setDateNodesForCurrentDate();
  }

  setDateNodesForCurrentDate() {
    // reset dates variable
    this.dateNodes = [];
    // we have to clone the var due to the mutability of the moment variable.
    let iterator = this.currentDate.clone();
    let startOfTheMonth = this.currentDate.clone();
    let endOfTheMonth = this.currentDate.clone().endOf("month");
    //Not the best approach but it works.
    while (iterator.isoWeekday() !== 7) {
      iterator.add(-1, "days");
    }
    //here we ensure that the iterator goes until first saturday after the end of the month
    do {
      //Constructing the node... TODO:Decouple this logic.
      let className = "date ";
      let formatted = iterator.format("YYYY-MM-DD");
      className = className + this.classProcessor(iterator);
      //If not the same month, should be a padder
      if (iterator.format("MM") !== startOfTheMonth.format("MM")) {
        className = "padder";
      }

      let text = iterator.format("DD");
      this.dateNodes.push({
        className,
        formatted,
        text
      });
      //add 1 to Iterator date
      iterator.add(1, "days");
      // eslint-disable-next-line no-undef
    } while (
      moment(iterator.format("YYYY-MM-DD")).isSameOrBefore(
        endOfTheMonth.format("YYYY-MM-DD")
      ) ||
      iterator.isoWeekday() !== 7
    );
  }

  classProcessor(date) {
    // eslint-disable-next-line no-undef
    if (moment().isSame(date, "day")) {
      return "today ";
    }
    return null;
  }

  /****************************************************/
  /* Function to handle Date selection event          */

  /****************************************************/
  @api
  setSelected(e) {
    let previousdate = this.template.querySelector(".selected");
    if (previousdate) {
      previousdate.classList.toggle("selected");
      //If reselected, just return
      if (previousdate.outerText === e.target.outerText) {
        return;
      }
    }
    e.target.classList.toggle("selected");
  }
}

class Calendar {
  dateNodes = [];
  currentDate;

  constructor() {
    this.currentDate = moment().startOf("month");
    this.setDateNodesForCurrentDate();
    this.gotoNextMonth = this.gotoNextMonth.bind(this);
    this.gotoPrevMonth = this.gotoPrevMonth.bind(this);
    this.gotoToday = this.gotoToday.bind(this);
    this.setDateNodesForCurrentDate = this.setDateNodesForCurrentDate.bind(
      this
    );
    Object.defineProperty(this, "month", {
      get: function () {
        return this.currentDate.format("MMMM");
      }.bind(this)
    });
    Object.defineProperty(this, "year", {
      get: function () {
        return this.currentDate.format("YYYY");
      }.bind(this)
    });
    this.dateNodes = [];
    this.setDateNodesForCurrentDate();
  }

  gotoNextMonth() {
    debugger;
    this.currentDate.add(1, "months").startOf("month");
    this.setDateNodesForCurrentDate();
  }

  gotoPrevMonth() {
    debugger;
    this.currentDate.subtract(1, "months").startOf("month");
    this.setDateNodesForCurrentDate();
  }

  gotoToday() {
    this.currentDate = moment().startOf("month");
    debugger;
    this.setDateNodesForCurrentDate();
  }

  setDateNodesForCurrentDate() {
    // reset dates variable
    this.dateNodes = [];
    // we have to clone the var due to the mutability of the moment variable.
    let iterator = this.currentDate.clone();
    let startOfTheMonth = this.currentDate.clone();
    let endOfTheMonth = this.currentDate.clone().endOf("month");
    //Not the best approach but it works.
    while (iterator.isoWeekday() != 7) {
      iterator.add(-1, "days");
    }
    //here we ensure that the iterator goes until first saturday after the end of the month
    while (
      moment(iterator.format("YYYY-MM-DD")).isBefore(
        endOfTheMonth.format("YYYY-MM-DD")
      ) ||
      iterator.isoWeekday() != 7
    ) {
      //Constructing the node... TODO:Decouple this logic.
      let className = "date";
      //If not the same month, should be a padder
      if (iterator.format("MM") != startOfTheMonth.format("MM")) {
        className = "padder";
      }
      let formatted = iterator.format("YYYY-MM-DD");
      let text = iterator.format("DD");
      this.dateNodes.push({
        className,
        formatted,
        text
      });
      //add 1 to Iterator date
      iterator.add(1, "days");
    }
  }
}
