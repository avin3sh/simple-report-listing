import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Picker, Button, TextInput } from 'react-native';

import ReportCard from '../../components/ReportCard';

const sample_image_url = "https://cdn.pixabay.com/photo/2016/03/15/09/08/quality-control-1257235__340.jpg";
const company_contact_number = '+1 617-765-2493';

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
      screenResult: reports
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
              placeholder="Enter a keyword..."
              style={{ height: 30, width: 250, borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }}
              onChangeText={(value) => {
                this.setState({
                  query: value
                })
              }}
            />

          </View>

          <Button
            title="Search"
            style={{ height: 30 }}
            color='#858080'
            onPress={() => { this.search() }}
          />
        </View>


        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>SORTY BY: </Text>
            <Picker
              style={{ height: 35, color: '#858080' }}
              onValueChange={(itemValue, itemIndex) => { this.sortResult(itemValue); }}>
              >
              <Picker.Item label="Recent First" value="rf" />
              <Picker.Item label="Oldest First" value="of" />
              <Picker.Item label="Cost - Low" value="cl" />
              <Picker.Item label="Cost - High" value="ch" />
            </Picker>
          </View>
          <Text>&nbsp;</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              title="🔧FILTER"
              style={{ height: 30 }}
              color='#858080'
            />
          </View>
        </View>
      </View>
    )
  }

  search() {
    const q = this.state.query.trim();
    let searchResult = [];
    if (q.length !== 0) {
    }
  }

  sortResult(criteria) {
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
    window.removeEventListener('resize', this._handleResize);
  }

  render() {
    return (
      <View style={styles.container}>
        <View ref='header' style={styles.headerArea}>
          <Image source={require('../../assets/logo.png')} style={{ width: 240, height: 30 }} />
          <Text>{company_contact_number}</Text>
        </View>
        <View style={styles.hr} />

        <View ref='content' style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.mainTitle}>Report Search Tool</Text>
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

  }
})