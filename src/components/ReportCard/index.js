import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import R from '../../res/Constants';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getMonthYear(timeISO) {

    let time = new Date(timeISO);

    let month = String(months[time.getMonth()]).toUpperCase().substring(0, 3);
    let year = time.getFullYear();

    return ('' + month + ' ' + year);
}

function trimDescription(description) {
  
    let newDescription = description.substr(0, R.report_card.MAX_DESCRIPTION_LENGTH-1);

    //re-trim if a word has been cut in between
    newDescription = newDescription.substr(0, Math.min(newDescription.length, newDescription.lastIndexOf(" ")))

    if(description.length >=R.report_card.MAX_DESCRIPTION_LENGTH){
        newDescription += "...";
    }

    return newDescription;
}


export default function index(props) {
    const report = props.report;
    return (
        <View style={styles.card}>
            <Image source={{ uri: report.image }} style={{ width: 120, height: 150 }} />
            <View style={styles.content}>
                <Text style={styles.title}>{report.title}</Text>
                <Text style={styles.description}>{trimDescription(report.description)}</Text>
                <Text style={styles.published}>{R.report_card.PUBLISHED_LABEL}: {getMonthYear(report.published_on)}</Text>
                <Text style={styles.cost}>{R.report_card.COST_LABEL}: {report.currency}{report.cost}</Text>
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
    },

    published: {
        color: '#62717c',
        fontSize: 13,
        marginBottom: 5
    },

    cost: {
        color: '#62717c',
        fontSize: 13,
        marginBottom: 5
    }
})
