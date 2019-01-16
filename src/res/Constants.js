const R = {

    meta: {
        TOOL_NAME: 'Report Search Tool',
        COMPANY_CONTACT: '+1 617-765-2493',
        MIN_REPORT_COST: 0,
        MAX_REPORT_COST: 10000,
        api: {
            URL: 'https://5c3c5b9d29429300143fe4c3.mockapi.io/api/v1/reports/',
        }
    },

    dashboard: {
        result_manipulators: {
            SEARCH_BUTTON_LABEL: 'Search',
            SEARCHBOX_PLACEHOLDER: 'Enter a keyword...',

            SORT_LABEL: 'SORT BY',
            FILTER_BUTTON_LABEL: '🔧FILTER',
            sort_criterias: {
                RECENT_FIRST: 'Recent - First',
                OLDEST_FIRST: 'Oldest - First',
                COST_LOW: 'Cost - Low',
                COST_HIGH: 'Cost - High'
            },

            search: {
                MAX_DB_SUGGESTIONS: 5,
                MAX_ALREADY_SEARCHED_SUGGESTIONS: 3,
                MAX_SUGGESTION_LENGTH: 30
            }
        },

        result_area: {
            NO_RESULT: 'Sorry, your query resulted in nothing!'
        },

        errors: {
            FIRST_LOAD_FETCH_ERROR: 'Unable to communicate with our server, please try again later',
            INDIVIDUAL_REPORT_FETCH_ERROR: 'Some error occured while retrieving the details, please try again later.',
            INVALID_DATE_FORMAT_ERROR: 'Please enter date range in yyyy-mm-dd format'
        }

    },

    report_card: {
        PUBLISHED_LABEL: 'PUBLISHED',
        COST_LABEL: 'COST OF REPORT',
        MAX_DESCRIPTION_LENGTH: 250,
    }
}

export default R;