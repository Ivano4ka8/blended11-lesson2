import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';
import MyModal from 'components/Modal/Modal';

export class Gallery extends Component {
  state = {
    error: null,
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    isEmpty: false,
    isVisible: false,
    showModal: false,
    largeImg: '',
    alt: '',
  };

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
      const {
        photos,
        total_results,
        per_page,
        page: currentPage,
      } = await ImageService.getImages(query, page);
      if (photos.length === 0) {
        this.setState({ isEmpty: true });
      }
      this.setState(prevState => ({
        images: [...prevState.images, ...photos],
        isVisible: currentPage < Math.ceil(total_results / per_page),
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onHandleSubmit = value => {
    if (value.trim() === '') return;
    this.setState({
      query: value,
      images: [],
      page: 1,
      isEmpty: false,
      error: null,
    });
  };

  onLoadMoreClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  openModal = (largeImg, alt) => {
    this.setState({ largeImg, showModal: true, alt });
  };

  closeModal = () => {
    this.setState({ largeImg: '', showModal: false, alt: '' });
  };

  render() {
    const {
      images,
      error,
      isEmpty,
      isVisible,
      isLoading,
      showModal,
      largeImg,
      alt,
    } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onHandleSubmit} />
        {error && (
          <Text textAlign="center">❌ Something went wrong - {error}</Text>
        )}
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {images.length > 0 && (
          <Grid>
            {images.map(({ id, avg_color, alt, src }) => (
              <GridItem
                key={id}
                onClick={() => this.openModal(src.medium, alt)}
              >
                <CardItem color={avg_color}>
                  <img src={src.large} alt={alt} />
                </CardItem>
              </GridItem>
            ))}
          </Grid>
        )}
        {isVisible && (
          <Button
            type="button"
            onClick={this.onLoadMoreClick}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        )}

        <MyModal
          alt={alt}
          modalIsOpen={showModal}
          closeModal={this.closeModal}
          src={largeImg}
        />
      </>
    );
  }
}
