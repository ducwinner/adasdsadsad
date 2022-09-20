import {
  Card,
  Page,
  Layout,
  Heading,
  FormLayout,
  TextField,
  Form,
  Select,
  ChoiceList,
  DataTable,
  TextStyle,
} from '@shopify/polaris';
// import {getProductAll} from "../api/productALL.js"
import React from 'react';
import { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ProductCollection from '../components/ProductCollection';
import ProductTags from '../components/ProductTags';
import SpecificProducts from '../components/SpecificProducts';
import { useQuery } from '@apollo/client';
import '../styles/home.css';
import { customProductAll, customProductsByTags, customCollections } from '../function/customData';
import { queryCollections, queryProductAll, queryTags } from '../query';
import axios from 'axios';

export default function HomePage() {
  //hook
  const [productAll, setProductAll] = useState([]);
  const [collectionAll, setCollectionAll] = useState([]);
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState(0);
  const [priority, setPriority] = useState('');
  const [priorityErr, setPriorityErr] = useState(false);
  const [rulePriceValue, setRulePriceValue] = useState('');
  const [priceErr, setPriceErr] = useState(false);
  const [selectStatus, setSelectStatus] = useState("Enable");
  const [selectApply, setSelectApply] = useState('');
  const [selectCustomPrice, setSelectCustomPrice] = useState('');
  const [isOkSave, setIsOKSave] = useState(false);
  const [rows, setRows] = useState([]);
  const [inputDiscount, setDiscount] = useState({onePrice: '', fixed: '', percent: ''})
  //redux
  const productsSpecific = useSelector((state) => state.specificProduct.data);
  const tagsQuery = useSelector((state) => state.tags.data);
  const collectionsQuery = useSelector((state) => state.collections.data);

  // call api: get all Products, Collections, Tags
  const {} = useQuery(queryProductAll, {
    onCompleted(data) {
      const result = customProductAll(data);
      setProductAll(result);
    },
  });

  const {} = useQuery(queryCollections, {
    onCompleted(data) {
      const result = customCollections(data);
      setCollectionAll(result);
    },
  });

  const {} = useQuery(queryTags, {
    onCompleted(data) {
      const result = data.shop.productTags.edges.map((e) => {
        return e.node;
      });
      setTags(result);
    },
  });


  // call product by tags
  const getProductsByTags = useCallback(async () => {
    try {
      const data = await axios.post('http://localhost:8686/api/getProductsByTags', { tags: tagsQuery });
      const result = customProductsByTags(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }, [tagsQuery])


  // Validate all require
  useEffect(() => {
    if (name && priority && !priorityErr && rulePriceValue && !priceErr && selectApply && selectCustomPrice && nameErr == 0 && selectStatus == "Enable") {

      setIsOKSave(true);
    } else {
      setIsOKSave(false);
    }
  },);

  const handleNameChange = useCallback((value) => {
    setName(value)
    const checkSpace = /\s/
    if(!value) {
      setNameErr(1)
    } else if(checkSpace.test(value)) {
      setNameErr(2)
    } else {
      setNameErr(0)
    }
  }, []);

  const handleSelectChange = useCallback((value) => setSelectStatus(value), []);

  const handleSelectApplyChange = useCallback((value) => setSelectApply(value), []);

  const handleSelectCustomPrice = useCallback((value) => {
    if (value == 'percent')  {
      if(rulePriceValue > 100) {
        setPriceErr(true);
      } else {
        setPriceErr(false);
      }
    } else {
      setPriceErr(false);
    }

    setRulePriceValue(inputDiscount[value]);
    console.log()
    setSelectCustomPrice(value);
  }, [rulePriceValue,inputDiscount]);

  const handlePriorityChange = useCallback((value) => {
    // check integer
    const regex = /(?<=\s|^)\d+(?=\s|$)/;
    // validata rule = percent
    if (value < 0 || value > 99 || !regex.test(value)) {
      setPriorityErr(true);
    } else {
      setPriorityErr(false);
    }
    setPriority(value);
  }, []);

  const handlevRulePriceChange = useCallback(
    (value) => {
      console.log(value)
    console.log('1',inputDiscount)
      //Save input Rule discount
      switch(selectCustomPrice[0]) {
        case 'onePrice':
          setDiscount(prev => ({
            ...prev,
            onePrice: value
          }))
          break;
        case 'fixed':
          setDiscount(prev => ({
            ...prev,
            fixed: value
          }))
          break;
        default:
          setDiscount(prev => ({
            ...prev,
            percent: value
          }))
      }

    console.log('2',inputDiscount)
      // validate input 
      if (value < 0) {
        setPriceErr(false);
        value = Math.abs(value);
      }

      if (value > 100 && selectCustomPrice == 'percent') {
        setPriceErr(true);
      } else {
        setPriceErr(false);
      }

      setRulePriceValue(value);
    },
    [selectCustomPrice,inputDiscount]
  );

  // Call products with Rule
  const getProductsByRule = useCallback(async () => {
    let productApply = [];
    switch (selectApply[0]) {
      case 'specific':
        productApply = productsSpecific;
        break;
      case 'tags':
        productApply = await getProductsByTags();

        break;
      case 'collection':
        const colectionsMatch = collectionAll.filter((e) => collectionsQuery.includes(e.id));

        productApply = colectionsMatch.map((e) => e.products).flat();
        break;
      default:

        productApply = productAll;
    }
    return productApply;
  }, [selectApply, productsSpecific, collectionsQuery, productAll, tagsQuery]);

  const handlePriceByRule = useCallback(
    (data) => {
      const productsAfterApply = data.map((e) => {
        const titleProduct = e.title;
        const currency = e.currency
        // change all prices with one price
        if (selectCustomPrice == 'onePrice') {
          const variants = e.variants.map((e) => {
            const title = e.title;
            const currentPrice = +e.price;
            if (currentPrice < +rulePriceValue) {
              return {
                title,
                currentPrice,
                lastPrice: currentPrice,
              };
            } else {
              return {
                title,
                currentPrice,
                lastPrice: +rulePriceValue,
              };
            }
          });
          return {
            title: titleProduct,
            variants,
            currency
          };

          // change prices with a fixed amount
        } else if (selectCustomPrice == 'fixed') {
          const variants = e.variants.map((e) => {
            const title = e.title;
            const currentPrice = +e.price;
            if (currentPrice < +rulePriceValue) {
              return {
                title,
                currentPrice,
                lastPrice: currentPrice,
              };
            } else {
              return {
                title,
                currentPrice,
                lastPrice: currentPrice - +rulePriceValue,
              };
            }
          });
          return {
            title: titleProduct,
            variants,
            currency
          };

          // change price by percentage %
        } else {
          const variants = e.variants.map((e) => {
            const title = e.title;
            const currentPrice = +e.price;
            const price = currentPrice - (currentPrice * +rulePriceValue) / 100;
            return {
              title,
              currentPrice,
              lastPrice: price,
            };
          });
          return {
            title: titleProduct,
            variants,
            currency
          };
        }
      });

      return productsAfterApply;
    },
    [rulePriceValue, selectCustomPrice]
  );

  const handleAddPricingRule = async () => {
    if(!isOkSave) return

    const data = await getProductsByRule();
    const dataAfterApplyRule = handlePriceByRule(data);

    // data Table
    let rows = [];
    dataAfterApplyRule.forEach((e, index) => {
      // limit 10 row
      let productName = '';
      if (e.variants.length == 1) {
        productName = `${e.title} (all variant)`;
      } else {
        productName = `${e.title} (${e.variants[0].title})`;
      }
      if (index < 10) {
        rows.push([productName, `${e.variants[0].currentPrice} ${e.currency}`, `${e.variants[0].lastPrice} ${e.currency}`]);
      }
    });
    setRows(rows);
  };

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
        </Layout.Section>
        <Layout.Section>
          <Layout>
            <Layout.Section>
              <Heading>NEW PRICING RULE</Heading>
              <Card sectioned title="General Information">
                <Form noValidate>
                  <FormLayout>
                    <TextField
                      value={name}
                      onChange={handleNameChange}
                      label="Name"
                      type="text"
                      autoComplete="off"
                      helpText={nameErr !== 0 && <TextStyle variation="negative">{nameErr == 1 ? 'Enter this field' : 'Name has not space'}</TextStyle>}
                    />
                    <TextField
                      value={priority}
                      onChange={handlePriorityChange}
                      label="Priority"
                      placeholder="0"
                      type="number"
                      autoComplete="off"
                      helpText={
                        priorityErr && (
                          <TextStyle variation="negative">
                            Please enter integer from 0 to 99, 0 is the hightest priority
                          </TextStyle>
                        )
                      }
                    />

                    <Select
                      label="Status"
                      options={['Enable', 'Disable']}
                      onChange={handleSelectChange}
                      value={selectStatus}
                    />
                  </FormLayout>
                </Form>
              </Card>
              <Card sectioned title="Apply to Products">
                <ChoiceList
                  choices={[
                    { label: 'All products', value: 'all' },
                    {
                      label: 'Specific product',
                      value: 'specific',
                      renderChildren: () =>
                        selectApply[0] == 'specific' && <SpecificProducts productAll={productAll} />,
                    },
                    {
                      label: 'Product collection',
                      value: 'collection',
                      renderChildren: () =>
                        selectApply[0] == 'collection' && <ProductCollection collecionAll={collectionAll} />,
                    },
                    {
                      label: 'Product tags',
                      value: 'tags',
                      renderChildren: () => selectApply[0] == 'tags' && <ProductTags tags={tags} />,
                    },
                  ]}
                  selected={selectApply}
                  onChange={handleSelectApplyChange}
                />
              </Card>
              <Card sectioned title="Custom Price">
                <ChoiceList
                  choices={[
                    { label: 'Apply a price to selected products', value: 'onePrice' },
                    {
                      label: 'Decrease a fixed amount of the original prices of the select products',
                      value: 'fixed',
                    },
                    {
                      label: 'Decrease the original prices of the select product by percentage % ',
                      value: 'percent',
                    },
                  ]}
                  selected={selectCustomPrice}
                  onChange={handleSelectCustomPrice}
                />
                <TextField
                  suffix={selectCustomPrice == 'percent' && <div>%</div>}
                  value={rulePriceValue}
                  onChange={handlevRulePriceChange}
                  label="Amount"
                  type="number"
                  autoComplete="off"
                  helpText={
                    priceErr && (
                      <TextStyle variation="negative">
                        {selectCustomPrice == 'percent' && rulePriceValue > 100
                          ? 'Please enter number from 0 to 99'
                          : null}
                      </TextStyle>
                    )
                  }
                />
              </Card>
            </Layout.Section>
            <Layout.Section secondary>
              <div className="pricing-detail">
                <div className="pricing-detail-heading">Show product pricing detail</div>
                <DataTable
                  columnContentTypes={['text', 'text', 'text']}
                  headings={['Product', 'Origin Price', 'Modified Price']}
                  rows={rows}
                />
              </div>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section>
          <div className="header-footer">
            <button className={isOkSave ? 'button-save' : 'button-save blur'} onClick={handleAddPricingRule}>
              Save
            </button>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
