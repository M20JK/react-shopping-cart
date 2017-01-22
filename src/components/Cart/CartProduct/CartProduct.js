/**
 * @flow
 * @module CartProduct
 * @extends React.Component
 *
 * @author Oleg Nosov <olegnosov1@gmail.com>
 * @license MIT
 *
 * @description
 * React component to display product in cart.
 */
import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';

import ProductPropertyDescription
  from './ProductPropertyDescription/ProductPropertyDescription';
import { isNaturalNumber } from '../../../helpers';

const
  propTypes = {
    productKey: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    properties: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    ),
    propertiesToShow: PropTypes.arrayOf(
      PropTypes.string,
    ),
    imagePath: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    iconTrashClassName: PropTypes.string.isRequired,
    onRemoveProduct: PropTypes.func.isRequired,
    onUpdateProduct: PropTypes.func.isRequired,
    getLocalization: PropTypes.func.isRequired,
  },
  defaultProps = {
    properties: {},
    propertiesToShow: [],
  };

export default class CartProduct extends Component {

  static propTypes = propTypes;
  static defaultProps = defaultProps;

  /*
   * Create form-group for each of properties which is in propertiesToShow
   * array
   */
  static generateProductDescription = (
    properties : {
      [propName : string]: number|string
    },
    propertiesToShow: Array<string>,
    getLocalization: Function,
  ) : Array<React$Element<any>> =>
    Object
      .entries(properties)
      .reduce(
        (acc, [propName, propValue]) => [
          ...acc, ...(
          propertiesToShow.indexOf(propName) + 1
          ? [
            <ProductPropertyDescription
              key={propName}
              name={propName}
              value={propValue}
              getLocalization={getLocalization}
            />,
          ]
          : []
        )]
    , []);

  handleRemoveProductClick = () =>
    void this.props.onRemoveProduct(
        this.props.productKey,
    );

  handleQuantityValueChange = (
    { target: { value } } : { target : HTMLInputElement },
  ) => {
    const quantity = +value;
    /*
     * Check if quantity value is correct
     * and then update product
     */
    if (isNaturalNumber(quantity))
      this.props.onUpdateProduct(
        this.props.productKey, { quantity },
      );
  };

  render() {
    const {
      name,
      imagePath,
      path,
      quantity,
      currency,
      price,
      properties,
      propertiesToShow,
      iconTrashClassName,
      getLocalization,
    } = this.props;

    const {
      handleQuantityValueChange,
      handleRemoveProductClick,
    } = this;

    const {
      generateProductDescription,
    } = CartProduct;

    const total = price * quantity;

    const localizationScope = {
      quantity,
      price,
      total,
      currency,
      name,
      get localizedName() {
        return getLocalization(name, localizationScope);
      },
      get localizedCurrency() {
        return getLocalization(currency, localizationScope);
      },
    };

    return (
      <div
        className="list-group-item list-group-item-action animated"
      >
        <Link to={path}>
          <div className="list-group-item-heading">
            { getLocalization('productName', localizationScope) }
          </div>
        </Link>
        <div className="list-group-item-text row">
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 m-b-1">
            <Link to={path}>
              <img className="img-fluid" src={imagePath} />
            </Link>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-5">
            <div className="form-group row">
              <label
                htmlFor="quantity"
                className="col-xs-6 col-md-5 col-lg-4 col-form-label"
              >
                { getLocalization('quantityLabel', localizationScope) }
              </label>
              <div className="col-xs-6 col-md-7 col-lg-8">
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={handleQuantityValueChange}
                />
              </div>
            </div>
            {
              generateProductDescription(
                properties,
                propertiesToShow,
                getLocalization,
              )
            }
            <div className="form-group row">
              <label
                htmlFor="price"
                className="col-xs-6 col-md-5 col-lg-4 col-form-label"
              >
                {
                  getLocalization(
                    'priceLabel', localizationScope,
                  )
                }
              </label>
              <div className="col-xs-6 col-md-7 col-lg-8 col-form-label">
                {
                  getLocalization(
                    'priceValue', localizationScope,
                  )
                }
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="total"
                className="col-xs-6 col-md-5 col-lg-4 col-form-label"
              >
                {
                  getLocalization(
                    'totalLabel', localizationScope,
                  )
                }
              </label>
              <div className="col-xs-6 col-md-7 col-lg-8 col-form-label">
                {
                  getLocalization(
                    'totalValue', localizationScope,
                  )
                }
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
            <div className="form-group row">
              <div className="col-md-12 text-xs-center">
                <button
                  className="btn btn-danger form-control"
                  onClick={handleRemoveProductClick}
                >
                  <i className={iconTrashClassName} />
                  { getLocalization('remove', localizationScope) }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
