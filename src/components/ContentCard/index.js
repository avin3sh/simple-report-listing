import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import R from '../../res/Constants';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getMonthYear(timeISO) {

    let time = new Date(timeISO);

    let month = String(months[time.getMonth()]).toUpperCase().substring(0, 3);
    let year = time.getFullYear();

    return ('' + month + ' ' + year);
}


export default function index(props) {
    const report = props.report;
    return (
        <View style={styles.card}>
            <Image source={{ uri: report.image }} style={{ width: 120, height: 150 }} />
            <View style={styles.content}>
                <Text style={styles.title}>{report.title}</Text>
                <View style={styles.meta_data}>
                    <Text style={styles.published}>{R.report_card.PUBLISHED_LABEL}: {getMonthYear(report.published_on)}</Text>
                    <Text style={styles.cost}>{R.report_card.COST_LABEL}: {report.currency}{report.cost}</Text>
                </View>
                <Text style={styles.description}>{report.description}</Text>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        border: 1,
        borderColor: '#ededed',
        backgroundColor: '#f6f6f6',
        padding: 10,
        marginBottom: 5,
        width: '100%',
        flexWrap: 'wrap'

    },

    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 8,
        width: '85%',
        maxWidth: '100%',
    },

    title: {
        color: '#34a99c',
        fontSize: 18,
        marginBottom: 5
    },

    description: {
        fontSize: 14,
        marginBottom: 5,
        maxHeight: '100%',
        overflow: 'scroll'
    },

    published: {
        color: '#62717c',
        fontSize: 13,
    },

    cost: {
        color: '#62717c',
        fontSize: 13,
        marginLeft: 7,
    },
    meta_data: {
        flexDirection: 'row',
        marginBottom: 5
    }

})