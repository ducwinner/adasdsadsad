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
import { getProductAll, getProductByCollections, getProductByTags } from '../data/productAll';
// import { getProductByRule } from '../data/productAll';
import '../styles/home.css';

export default function HomePage() {
  //hook
  const [productAll, setProductALL]= useState([])
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('');
  const [priorityErr, setPriorityErr] = useState(false);
  const [price, setPrice] = useState('');
  const [priceErr, setPriceErr] = useState(false);
  const [selectStatus, setSelectStatus] = useState('');
  const [selectApply, setSelectApply] = useState('');
  const [selectCustomPrice, setSelectCustomPrice] = useState('');
  const [productApply, setProductApply] = useState([])
  const [rows, setRows] = useState([
    ['Emerald Silk Gown', '$875.00'],
    ['Mauve Cashmere Scarf', '$230.00'],
    ['Navy Merino Wool', '$445.00'],
  ])

  //redux 
  const productsSpecific = useSelector(state => state.specificProduct.data)
  const tagsQuery = useSelector(state => state.tags.data)
  const collectionsQuery = useSelector(state => state.collections.data)

  
  useEffect(() => {
    // const fetchProducts = async() => {
    //   console.log(collectionsQuery)
    //   const productsAll = await getProductByCollections(collectionsQuery[0])
    //   console.log('productsAll',productsAll)
    // }
    // fetchProducts()

    const fetchProducts = async() => {
      const productApply = await getProductByTags(tagsQuery)

      console.log(productApply)
      // let rows = []
      // productApply.forEach(e => {
      //   if(e.variants.length == 1) {
      //     rows.push([`${e.title} + ( all variant )`,e.variants[0].price])
      //   } else {
      //     rows.push([`${e.title} + ( ${e.variants[0].title})`,e.variants[0].price])
      //     rows.push([`${e.title} + ( ${e.variants[1].title})`,e.variants[1].price])
      //   }
      // })
      // console.log(rows)
      // setRows(rows)
    } 

    fetchProducts()
  },[])

  // call api: get all Products 
  useEffect(() => {
    const fetchProducts = async() => {
      const productsAll = await getProductAll()
      setProductALL(productsAll)
    }
    fetchProducts()
  },[])

  const handleNameChange = useCallback((value) => setName(value), []);

  const handlePriorityChange = useCallback((value) => {
    const regex = /(?<=\s|^)\d+(?=\s|$)/;

    if (value < 0 || value > 99 || !regex.test(value)) {
      setPriorityErr(true);
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
   let productApply = []
    // const getProductsWithRule = async () => {
    //   if(selectApply == 'specific') {
    //     productApply = productsSpecific
    //   } else if(selectApply == 'tags') {
    //     productApply = await getProductByTags(tagsQuery)
    //   } else if( selectApply == 'collection') {
    //     productApply = await getProductByCollections(collectionsQuery)
    //   } else {
    //     productApply = productAll
    //   }
    //   setProductApply(productApply)
    //  }
    //  getProductsWithRule()
    let rows = []

    productApply.forEach(e => {
      if(e.variants.length == 1) {
        rows.push([`${e.title} + ( all variant )`,e.variants[0].price])
      } else {
        rows.push([`${e.title} + ( ${e.variants[0].title})`,e.variants[0].price])
        rows.push([`${e.title} + ( ${e.variants[1].title})`,e.variants[1].price])
      }
    })
     
  },[tagsQuery,collectionsQuery,selectApply,productsSpecific])
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
                      renderChildren: () => selectApply == 'specific' && <SpecificProducts productAll={productAll} />,
                    },
                    {
                      label: 'Product collection',
                      value: 'collection',
                      renderChildren: () => selectApply == 'collection' && <ProductCollection/>,
                    },
                    {
                      label: 'Product tags',
                      value: 'tags',
                      renderChildren: () => selectApply == 'tags' && <ProductTags/>,
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
