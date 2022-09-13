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
import React from 'react';
import { useState, useCallback } from 'react';
import ProductCollection from '../components/ProductCollection';
import ProductTags from '../components/ProductTags';
import SpecificProducts from '../components/SpecificProducts';
import '../styles/home.css';

export default function HomePage() {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('');
  const [priorityErr, setPriorityErr] = useState(false);
  const [price, setPrice] = useState('');
  const [priceErr, setPriceErr] = useState(false);
  const [selectStatus, setSelectStatus] = useState('');
  const [selectApply, setSelectApply] = useState('');
  const [selectCustomPrice, setSelectCustomPrice] = useState('');

  const rows = [
    ['Emerald Silk Gown', '$875.00'],
    ['Mauve Cashmere Scarf', '$230.00'],
    ['Navy Merino Wool', '$445.00'],
  ];

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
    if (value < 0) {
      value = Math.abs(value);
    }
    setPrice(value);
  }, []);

  const handleSelectChange = useCallback((value) => setSelectStatus(value), []);

  const handleSelectApplyChange = useCallback((value) => setSelectApply(value), []);

  const handleSelectCustomPrice = useCallback((value) => setSelectCustomPrice(value), []);

  return (
    <Page fullWidth>
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
                  renderChildren: () => selectApply == 'tags' && <ProductTags />,
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
    </Page>
  );
}
