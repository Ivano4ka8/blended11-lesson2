import { Component } from 'react';

import { FiSearch } from 'react-icons/fi';
import { FormBtn, InputSearch, SearchFormStyled } from './SearchForm.styled';

export class SearchForm extends Component {
  state = {
    query: '',
  };

  handleInput = e => {
    this.setState({ query: e.target.value.toLowerCase().trim() });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.onSubmit(this.state.query);
    this.setState({ query: '' });
  };

  render() {
    const { handleInput, handleSubmit } = this;
    const { query } = this.state;

    return (
      <SearchFormStyled onSubmit={handleSubmit}>
        <FormBtn type="submit">
          <FiSearch size="16px" />
        </FormBtn>
        <InputSearch
          onChange={handleInput}
          placeholder="What do you want to write?"
          name="search"
          required
          autoFocus
          value={query}
        />
      </SearchFormStyled>
    );
  }
}
