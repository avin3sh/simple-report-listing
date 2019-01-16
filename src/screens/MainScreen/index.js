import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Picker, Button, TextInput } from 'react-native';

import ReportCard from '../../components/ReportCard';
import ContentCard from '../../components/ContentCard';

import R from '../../res/Constants';
import DateTime from '../../utils/DateTime';

const placeholdeReport = {
  "id": "0",
  "image": "http://lorempixel.com/640/480/abstract",
  "title": "...",
  "description": "...",
  "currency": "$",
  "cost": 0,
  "published_on": "2018-01-01T01:01:01.053Z"
};
export default class index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      allreports: [],
      screenResult: [],

      //autocomplete
      previousSearches: [],
      suggestions: [],

      //flags
      showFilterModal: false,
      firstLoad: false,
      searching: false,

      //individual report modal
      report: placeholdeReport,
      showContentModal: false,
      fetchingReport: true,

      //sorting
      sortingCriteria: 'rf',

      //filterValues
      costLowerlimit: R.meta.MIN_REPORT_COST,
      costUpperLimit: R.meta.MAX_REPORT_COST,
      date_from: new Date('2010-01-01'),
      date_till: new Date(),
      filterActive: false,

    }

  }

  _resetManipulators() {
    this.setState({
      // sorting
      sortingCriteria: 'rf',

      //filterValues
      costLowerlimit: R.meta.MIN_REPORT_COST,
      costUpperLimit: R.meta.MAX_REPORT_COST,
      date_from: new Date('2010-01-01'),
      date_till: new Date(),
    })
  }

  _handleResize = () => this.setState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  _showModal = () => {
    this.setState({ showContentModal: true });
  }

  _hideModal = () => {
    this.setState({ showContentModal: false });
  }

  _renderLoadingGif() {
    return (
      <View style={styles.loadingGif}>
        <Image source={require('../../assets/loading.gif')} style={{ height: 255, width: 255 }} />
      </View>
    )
  }

  _renderResultHelper() {

    let msg = '';

    if (this.state.firstLoad && !this.state.searching) {

      if ((this.state.query.trim().length !== 0 && this.state.screenResult.length === 0)) {
        msg = R.dashboard.result_area.NO_RESULT
      }
    }

    return (
      <View style={styles.resultHelper}>
        <Text style={styles.modalTextLabelStyle}>{msg}</Text>
      </View>
    )
  }

  _renderReportsList() {
    return (
      this.state.screenResult.map(report => {
        return (
          <section onClick={() => this._getReport(report.id)} className="reportCardContainer">
            <ReportCard report={report} />
          </section>
        );
      })
    )
  }

  _getReport(id) {
    this.setState({
      showContentModal: true,
      fetchingReport: true
    }, () => {

      fetch(R.meta.api.URL + id)
        .then(resp => resp.json())
        .then(reportJson => {
          this.setState({
            report: reportJson
          }, () => this.setState({ fetchingReport: false }))
        })
        .catch(err => {
          console.log(err);
          alert(R.dashboard.errors.INDIVIDUAL_REPORT_FETCH_ERROR);
        })

    })

  }

  _renderManipulators() {
    return (
      <View style={styles.resultManipulatorContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column' }}>
            <TextInput
              value={this.state.query}
              placeholder={R.dashboard.result_manipulators.SEARCHBOX_PLACEHOLDER}
              style={{ height: 30, width: '250px', borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.search();
                }

              }}
              onChangeText={(value) => {
                this._handleUserTyping(value);
              }}
            />

            <View style={styles.suggestionBox}>
              <div className="suggestionBoxContainer">
                {this.state.suggestions.map(suggestion => {
                  let suggestionLength = R.dashboard.result_manipulators.search.MAX_SUGGESTION_LENGTH;
                  if (suggestion.searched) suggestionLength -= 10;//removing 10 characters to show 'searched:' label
                  return (
                    <span className="suggestionBoxItems" onClick={() => { this.setState({ query: suggestion.title, suggestions: [] }) }}>
                      {suggestion.searched ? (<span className="suggestionSearchedLabel">searched: </span>) : null}
                      {suggestion.title.substr(0, suggestionLength)}
                      {suggestion.title.length > suggestionLength ? "..." : null}
                    </span>
                  )
                })}
              </div>
            </View>

          </View>

          <Button
            title={R.dashboard.result_manipulators.SEARCH_BUTTON_LABEL}
            style={{ height: 30 }}
            color='#858080'
            onPress={() => { this.search() }}
          />
        </View>


        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{R.dashboard.result_manipulators.SORT_LABEL}: </Text>
            <Picker
              selectedValue={this.state.sortingCriteria}
              style={{ height: 35, color: '#858080' }}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ sortingCriteria: itemValue }, () => {
                  this.sortResult();
                })
              }}>
              >
              <Picker.Item label={R.dashboard.result_manipulators.sort_criterias.RECENT_FIRST} value="rf" />
              <Picker.Item label={R.dashboard.result_manipulators.sort_criterias.OLDEST_FIRST} value="of" />
              <Picker.Item label={R.dashboard.result_manipulators.sort_criterias.COST_LOW} value="cl" />
              <Picker.Item label={R.dashboard.result_manipulators.sort_criterias.COST_HIGH} value="ch" />
            </Picker>
          </View>
          <Text>&nbsp;</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              title={R.dashboard.result_manipulators.FILTER_BUTTON_LABEL}
              style={{ height: 30 }}
              color='#858080'
              onPress={() => {
                this.setState({ showFilterModal: !this.state.showFilterModal })
              }}
            />
            {this.state.filterActive && this._renderFilterClearBtn()}
          </View>
        </View>
      </View>
    )
  }

  _handleUserTyping(value) {
    const q = value.trim();
    this.setState({
      query: value
    })

    const suggestionDB = this.state.allreports.concat(this.state.previousSearches);
    let result = [];
    if (q.length > 2) {//give suggestions only if keyword is more than 3 chars long
      result = suggestionDB.filter(report => {
        let text = report.title;
        return text.toUpperCase().includes(q.toUpperCase());
      })
    }

    this.setState({
      suggestions: result.slice(0, R.dashboard.result_manipulators.search.MAX_DB_SUGGESTIONS)//show only five suggestions
    })

  }

  _renderFilterClearBtn() {
    return (
      <TouchableOpacity onPress={() => {
        this.setState({
          //filterValues
          costLowerlimit: R.meta.MIN_REPORT_COST,
          costUpperLimit: R.meta.MAX_REPORT_COST,
          date_from: new Date('2010-01-01'),
          date_till: new Date(),
          filterActive: false
        }, () => this._applyFilter())
      }}>
        <Text>clear</Text>
      </TouchableOpacity>
    )
  }

  _renderFilterModal() {
    return (
      <View style={styles.filterModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTextLabelStyle}>Cost: </Text>
          <Text style={styles.modalTextLabelStyle}>$</Text>
          <TextInput value={this.state.costLowerlimit}
            placeholder={this.state.costLowerlimit}
            onChangeText={(text) => {
              this.setState({
                costLowerlimit: text.replace(/[^0-9]/g, ''),
              });
            }}
            style={[styles.modalTextInputStyle, { width: 50 }]}
          />
          <Text style={styles.modalTextLabelStyle}> - </Text>
          <Text style={styles.modalTextLabelStyle}>$</Text>
          <TextInput
            value={this.state.costUpperLimit}
            placeholder={this.state.costUpperLimit}
            onChangeText={(text) => {
              this.setState({
                costUpperLimit: text.replace(/[^0-9]/g, ''),
              });
            }}
            style={[styles.modalTextInputStyle, { width: 50 }]}
          />
        </View>

        <View style={styles.modalContent}>
          <Text style={styles.modalTextLabelStyle}>Date Range: </Text>

          <TextInput
            ref="date_from_box"
            placeholder={DateTime.toISOFormat(this.state.date_from)}
            onChangeText={(text) => {
              this.setState({
                date_from: text
              })
            }}
            style={[styles.modalTextInputStyle, { width: 100 }]}
          />

          <Text style={styles.modalTextLabelStyle}> - </Text>

          <TextInput
            ref="date_to_box"
            placeholder={DateTime.toISOFormat(this.state.date_till)}
            onChangeText={(text) => {
              this.setState({
                date_till: text
              })
            }}
            style={[styles.modalTextInputStyle, { width: 100 }]}
          />

        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            title="Apply"
            onPress={() => this._verifyDate()}
          />
          <Text>&nbsp; &nbsp;</Text>
          <Button
            title="Cancel"
            onPress={() => this.setState({ showFilterModal: false })}
          />
        </View>
      </View>
    );
  }

  _verifyDate() {
    if (DateTime.isValidDate(this.state.date_from) && DateTime.isValidDate(this.state.date_till)) {
      this.setState({
        date_from: new Date(this.state.date_from),
        date_till: new Date(this.state.date_till)
      },
        () => {
          this._applyFilter();
          this.setState({ showFilterModal: false, filterActive: true })
        })
    } else {
      alert(R.dashboard.errors.INVALID_DATE_FORMAT_ERROR)
    }
  }

  _applyFilter() {
    let result = this.state.allreports.filter(report => {
      let d = new Date(report.published_on)
      return d >= this.state.date_from && d <= this.state.date_till && report.cost >= this.state.costLowerlimit && report.cost <= this.state.costUpperLimit;
    })

    this.setState({
      screenResult: result
    })
  }

  search() {
    const q = this.state.query.trim();
    const db = this.state.allreports;
    let result = [];
    this.setState({ searching: true })

    if (q.length !== 0) {
      result = db.filter(report => {
        let text = report.title + ' ' + report.description
        return text.includes(q);
      })

    } else {
      result = db;
    }

    let previousSearches = this.state.previousSearches;
    let thisSearch = { title: q, searched: true };
    if (!previousSearches.some(element => { return element.title === q })) {
      previousSearches.push(thisSearch);
    }

    this.setState({ screenResult: result, previousSearches: previousSearches },
      () => {
        this.setState({
          searching: false
        });
        this._resetManipulators();
      }
    )


  }

  sortResult(criteria = this.state.sortingCriteria) {
    let currResult = this.state.screenResult;
    let result = currResult;

    if (criteria === 'rf' || criteria === 'of') {
      currResult.sort(function (a, b) {
        a = new Date(a.published_on);
        b = new Date(b.published_on);
        return a > b ? -1 : a < b ? 1 : 0;
      });

      if (criteria === 'of')
        result = currResult.reverse();
      else
        result = currResult;
    } else {

      currResult.sort(function (a, b) {
        a = a.cost;
        b = b.cost;
        return a < b ? -1 : a > b ? 1 : 0;
      });

      if (criteria === 'ch')
        result = currResult.reverse();
      else
        result = currResult;
    }

    this.setState({
      screenResult: result
    })

  }

  componentDidMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentWillMount() {

    fetch(R.meta.api.URL)
      .then(resp => resp.json())
      .then(reportsJson => {

        this.setState({
          allreports: reportsJson,
          screenResult: reportsJson,
        }, () => {
          this.setState({ firstLoad: true });
          setInterval(() => {//keep updating DB every 10 minutes
            this.dynamicDBUpdate();
          }, R.meta.DATABASE_UPDATE_INTERVAL);
        })

      })
      .catch(err => {
        console.log(err);
        alert(R.dashboard.errors.FIRST_LOAD_FETCH_ERROR);
      })



    window.removeEventListener('resize', this._handleResize);
  }

  dynamicDBUpdate() {
    fetch(R.meta.api.URL)
      .then(resp => resp.json())
      .then(reportsJson => {

        this.setState({
          allreports: reportsJson,
        })

      })
      .catch(err => {
        console.log(err);
        //probably browser is offline
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <View ref='header' style={styles.headerArea}>
          <Image source={require('../../assets/logo.png')} style={{ width: 240, height: 30 }} />
          <Text>{R.meta.COMPANY_CONTACT}</Text>
        </View>
        <View style={styles.hr} />



        <View ref='content' style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.mainTitle}>{R.meta.TOOL_NAME}</Text>
          </View>

          <View style={styles.resultArea}>
            <View>
              {this._renderManipulators()}
              {this.state.showFilterModal && this._renderFilterModal()}
              <View style={styles.hrSecondary} />
            </View>
            <View style={styles.lowZIndex}>
              {this._renderResultHelper()}
              {(!this.state.firstLoad || this.state.searching) && this._renderLoadingGif()}
              {(this.state.firstLoad && !this.state.searching) && this._renderReportsList()}
            </View>
          </View>
        </View>


        <Modal show={this.state.showContentModal} handleClose={this._hideModal} >
          {this.state.fetchingReport && this._renderLoadingGif()}
          {(this.state.showContentModal && !this.state.fetchingReport) ? (<ContentCard report={this.state.report} />) : null}
        </Modal>

      </View>
    )
  }
}

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName} onClick={handleClose}>
      <section className="modal-main">
        {children}
        <TouchableOpacity onPress={handleClose}>
          <Button title="Close" />
        </TouchableOpacity>
      </section>
    </div>
  );
};


const styles = StyleSheet.create({

  container: {
    marginTop: 5,
    paddingLeft: '5%',
    paddingRight: '5%'
  },

  headerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 5
  },

  hr: {
    width: '100%',
    borderWidth: '1px',
    borderColor: '#000000'
  },

  hrSecondary: {
    width: '100%',
    borderWidth: '1px',
    borderColor: '#c5c8cb',
    marginBottom: 5,
    marginTop: 5,
    zIndex: -1
  },

  content: {
    flexDirection: 'column'
  },

  contentHeader: {
    flexDirection: 'column',
    alignItems: 'center'
  },

  mainTitle: {
    fontWeight: '500',
    fontSize: 25
  },

  resultArea: {

  },

  filterModal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'flex-end'

    //overlaysorcery

  },

  modalContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },

  modalTextInputStyle: {
    height: 30,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#c5c8cb',
    fontSize: 18
  },

  modalTextLabelStyle: {
    fontSize: 18
  },

  loadingGif: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  resultHelper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  resultManipulatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  lowZIndex: {
    zIndex: -1
  },

  suggestionBox: {
    zIndex: 10,
    position: 'absolute',
    marginTop: 31
  }




})