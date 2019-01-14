import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Picker, Button, TextInput } from 'react-native';

import ReportCard from '../../components/ReportCard';

import R from '../../res/Constants';
import DateTime from '../../utils/DateTime';

const sample_image_url = "https://cdn.pixabay.com/photo/2016/03/15/09/08/quality-control-1257235__340.jpg";

const reports = [
  {
    id: 101,
    image: sample_image_url,
    title: 'This is an example title for some research 2019-2020',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    currency: '$',
    cost: 4250,
    published_on: new Date('2018-10-01')
  },
  {
    id: 102,
    image: sample_image_url,
    title: 'This is an example title for some research 2014-2016',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    currency: '$',
    cost: 5190,
    published_on: new Date('2017-12-01')
  },
  {
    id: 103,
    image: sample_image_url,
    title: 'This is the third report of something happened in 2009-2014',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    currency: '$',
    cost: 3588,
    published_on: new Date('2014-10-01')
  },
  {
    id: 104,
    image: sample_image_url,
    title: 'This is fourth example report for some research 2011-2012',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    currency: '$',
    cost: 1200,
    published_on: new Date('2013-08-01')
  },
  {
    id: 105,
    image: sample_image_url,
    title: 'This is an example report - fifth one - for some research 2010-2012',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    currency: '$',
    cost: 350,
    published_on: new Date('2013-06-01')
  }
]

export default class index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      allreports: reports,
      screenResult: reports,
      showFilterModal: false,

      //sorting
      sortingCriteria: 'rf'

      //modalvalues
      costLowerlimit: R.meta.MIN_REPORT_COST,
      costUpperLimit: R.meta.MAX_REPORT_COST,
      date_from: new Date('2010-01-01'),
      date_till: new Date(),

    }

  }

  _handleResize = () => this.setState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  _renderReportsList() {
    return (
      this.state.screenResult.map(report => {
        return (
          <TouchableOpacity>
            <ReportCard report={report} />
          </TouchableOpacity>
        );
      })
    )
  }

  _renderManipulators() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column' }}>
            <TextInput
              value={this.state.query}
              placeholder={R.dashboard.result_manipulators.SEARCHBOX_PLACEHOLDER}
              style={{ height: 30, width: 250, borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }}
              onChangeText={(value) => {
                this.setState({
                  query: value
                })
              }}
            />

          </View>

          <Button
            title={R.dashboard.result_manipulators.SEARCH_BUTTON_LABEL}
            style={{ height: 30 }}
            color='#858080'
            onPress={() => { this.search() }}
          />
        </View>


        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
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
                this.setState({ showFilterModal: true })
              }}
            />
          </View>
        </View>
      </View>
    )
  }

  _renderFilterModal() {
    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center', }}>

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
        })
    } else {
      alert("Please enter date range in yyyy-mm-dd format")
    }
  }

  _applyFilter() {
    let result = this.state.allreports.filter(report => {
      return report.published_on >= this.state.date_from && report.published_on <= this.state.date_till && report.cost >= this.state.costLowerlimit && report.cost <= this.state.costUpperLimit;
    })

    this.setState({
      screenResult: result
    })
  }

  search() {
    const q = this.state.query.trim();
    let searchResult = [];
    if (q.length !== 0) {
    }
  }

  sortResult(criteria = this.state.sortingCriteria) {
    let currResult = this.state.allreports;
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
    window.removeEventListener('resize', this._handleResize);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showFilterModal && this._renderFilterModal()}
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
            {this._renderManipulators()}
            <View style={styles.hrSecondary} />
            {this._renderReportsList()}
          </View>
        </View>

      </View>
    )
  }
}

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
    marginTop: 5
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
  }
})