import * as React from 'react';
import { Select } from 'antd';
import { debounce } from 'throttle-debounce';
const Option = Select.Option;

interface ExpressionValueLookupState {
    options: any;
}

interface ExpressionValueLookupProps {
    values: any;
    readOnly: boolean;
    onChange: any;
    lookupKind: string;
}

class ExpressionValueLookup extends React.Component<ExpressionValueLookupProps, ExpressionValueLookupState> {

    constructor(props: any) {
        super(props);
        this.state = {
            options: [],
        };    
        if (props.values && props.values.length) {
            const originalValue = props.values[0];
            if (originalValue) {
                const parts = originalValue.match(/([^=]*)\(([^=]*)\)/);
                if ( parts && parts.length && parts.length === 3) {
                    this.state = {
                        options: [{value: parts[1], text: parts[2]}]
                    };
                }
                else {
                    this.state = {
                        options: [{value: originalValue, text: originalValue}]
                    };
                }
            }
        }
        this.fetch = debounce(400, this.fetch);
        this.handleSearch = this.handleSearch.bind(this);
        this.triggerChange = this.triggerChange.bind(this);
    }

    handleSearch(value: string) {
        this.fetch(value);
    }

    triggerChange(value: string, option: any) {
        if ( value !== this.props.values[0] ) {
            if (value) {
                const selectedOption = this.state.options.find((o: any) => o.value === value);
                if (selectedOption && selectedOption.text) {
                    value = `${value}(${selectedOption.text})`;
                }
            }
            this.props.onChange([value]);
        }
    }

    fetch(value: string) {
        const url = `/lookups/${this.props.lookupKind}?q=${value}`;
        fetch(url)
            .then((res) => res.json())
            .then((resData) => {
                this.setState({
                    options: resData
                });
            })
            .catch((error: any) => {
                this.setState({
                    options: []
                });
            });
    }

    render() {
        const state = this.state;
        const options = state.options.map((d: any, i: number) => <Option key={i} value={d.value}>{d.text}</Option>);
        return (
            <Select
                style={{width: 200}}
                defaultValue={this.props.values[0]}                
                showSearch={true}
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onSelect={this.triggerChange}
            >
                {options}
            </Select>
        );
    }
}

export default ExpressionValueLookup;