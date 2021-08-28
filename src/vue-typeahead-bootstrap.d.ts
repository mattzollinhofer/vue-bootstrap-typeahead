declare module 'vue-typeahead-bootstrap' {

    import {Component} from 'vue';

    interface Props {
        append?: string;
        autoClose?: boolean;
        backgroundVariant?: string;
        data: any[];
        disabled?: boolean;
        disabledValues?: any[];
        disableSort?: boolean;
        highlightClass?: string;
        inputClass?: string;
        maxMatches?: number;
        minMatchingChars?: number;
        prepend?: string;
        serializer?: (input: string) => string;
        showAllResults?: boolean;
        showOnFocus?: boolean;
        size?: 'sm' | 'lg';
        textVariant?: string;
    }

    const VueTypeaheadBootstrap: Component<any, any, any, Props>;

    export default VueTypeaheadBootstrap;
}
