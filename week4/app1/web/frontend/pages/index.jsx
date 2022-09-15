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
  Button,
} from '@shopify/polaris';
// import {getProductAll} from "../api/productALL.js"
import React from 'react';
import { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ProductCollection from '../components/ProductCollection';
import ProductTags from '../components/ProductTags';
import SpecificProducts from '../components/SpecificProducts';
// import { getProductByRule } from '../data/productAll';
import '../styles/home.css';

export default function HomePage() {
  let a = 0
  console.log('home',a)

  const productsSpecific = useSelector(state => state.specificProduct.data)
  const productTags = useSelector(state => state.tags.data)
  const productsCollection = useSelector(state => state.collections.data)
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('');
  const [priorityErr, setPriorityErr] = useState(false);
  const [price, setPrice] = useState('');
  const [priceErr, setPriceErr] = useState(false);
  const [selectStatus, setSelectStatus] = useState('');
  const [selectApply, setSelectApply] = useState('');
  const [selectCustomPrice, setSelectCustomPrice] = useState('');
  const [rows, setRows] = useState([
    ['Emerald Silk Gown', '$875.00'],
    ['Mauve Cashmere Scarf', '$230.00'],
    ['Navy Merino Wool', '$445.00'],
  ])

  const handleNameChange = useCallback((value) => setName(value), []);

  const handlePriorityChange = useCallback((value) => {
    const regex = /(?<=\s|^)\d+(?=\s|$)/;

    if (value < 0 || value > 99 || !regex.test(value)) {
      setPriorityErr(true);
      console.log(1);
    } else {
      setPriorityErr(false);
    }

    setPriority(value);
  }, []);

  const handlePriceChange = useCallback((value) => {
    console.log(value);
    if (value < 0) {
      value = Math.abs(value);
    }

    if (value > 100) {
      setPriceErr(true);
    }
    setPrice(value);
  }, []);

  const handleSelectChange = useCallback((value) => setSelectStatus(value), []);

  const handleSelectApplyChange = useCallback((value) => setSelectApply(value), []);

  const handleSelectCustomPrice = useCallback((value) => setSelectCustomPrice(value), []);

  const handleAddPricingRule = useCallback(() => {

    // const getProductsWithRule = async () => {
    //   let productApply = []
    //   if(selectApply == 'specific') {
    //     productApply = productsSpecific
    //   } else if(selectApply == 'tags') {
    //     productApply = await getProductByTags(tags)
    //   }
    //   productApply = await getProductByRule()
    //  }
    //  getProductsWithRule()
  },[])
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <div className='header-footer'><Button primary onClick={handleAddPricingRule}>Save</Button></div>
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
                          <TextStyle variation="warning">
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
                      renderChildren: () => selectApply == 'specific' && <SpecificProducts />,
                    },
                    {
                      label: 'Product collection',
                      value: 'collection',
                      renderChildren: () => selectApply == 'collection' && <ProductCollection />,
                    },
                    {
                      label: 'Product tags',
                      value: 'tags',
                      renderChildren: () => selectApply == 'tags' && <ProductTags a = {a} />,
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
                      label:
                        'Decrease a fixed amount of the original prices of the select products',
                      value: 'fixed',
                    },
                    {
                      label: 'Decrease the original prices of the select product bu percentage % ',
                      value: 'percent',
                    },
                  ]}
                  selected={selectCustomPrice}
                  onChange={handleSelectCustomPrice}
                />
                <TextField
                  suffix={selectCustomPrice == 'percent' && <div>%</div>}
                  value={price}
                  onChange={handlePriceChange}
                  label="Amount"
                  type="number"
                  autoComplete="off"
                  prefix={
                    !(selectCustomPrice == 'percent') && (
                      <div style={{ textDecoration: 'underline' }}>đ</div>
                    )
                  }
                  helpText={
                    priceErr && (
                      <TextStyle variation="warning">
                        {selectCustomPrice == 'percent' && price > 100
                          ? 'Please enter number from 0 to 99'
                          : ''}
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
                  columnContentTypes={['text', 'text']}
                  headings={['Title', 'Modified price']}
                  rows={rows}
                />
              </div>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section>
          <div className='header-footer'><Button primary>Save</Button></div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
