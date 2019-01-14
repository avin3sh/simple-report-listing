import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getMonthYear(time) {

    let month = String(months[time.getMonth()]).toUpperCase().substring(0, 3);
    let year = time.getFullYear();

    return ('' + month + ' ' + year);
}


export default function index(props) {
    const report = props.report;
    return (
        <View style={styles.card}>
            <View>
                <Image source={{ uri: report.image }} style={{ width: 120, height: 150 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{report.title}</Text>
                <Text style={styles.description}>{report.description}</Text>
                <Text style={styles.published}>PUBLISHED: {getMonthYear(report.published_on)}</Text>
                <Text style={styles.cost}>COST OF REPORT: {report.currency}{report.cost}</Text>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        border: 1,
        borderColor: '#ededed',
        backgroundColor: '#f6f6f6',
        padding: 10,
        marginBottom: 5,
    },

    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 8,
        maxWidth: '100%'
    },

    title: {
        color: '#34a99c',
        fontSize: 18,
        marginBottom: 5
    },

    description: {
        fontSize: 14,
        marginBottom: 5
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
