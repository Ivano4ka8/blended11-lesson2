import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
  };

  componentDidMount() {
    this.getPhotos('cat', 1);
  }
  componentDidUpdate(_, prevState) {
    const { query, page } = this.state;
    if (prevState.query !== query || prevState.page !== page) {
      this.getPhotos(query, page);
    }
  }

  getPhotos = async (query, page) => {
    if (!query) {
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await ImageService.getImages(query, page);
      console.log(response);
    } catch (error) {
    } finally {
    }
  };

  onHandleSubmit = value => {
    this.setState({ query: value });
  };

  render() {
    return (
      <>
        <SearchForm onSubmit={this.onHandleSubmit} />
        <Text textAlign="center">Sorry. There are no images ... 😭</Text>
      </>
    );
  }
}
