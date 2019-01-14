const R = {

    meta: {
        TOOL_NAME: 'Report Search Tool',
        COMPANY_CONTACT: '+1 617-765-2493',
        MIN_REPORT_COST: 0,
        MAX_REPORT_COST: 10000
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
            }
        }

    },

    report_card: {
        PUBLISHED_LABEL: 'PUBLISHED',
        COST_LABEL: 'COST OF REPORT'
    }
}

export default R;