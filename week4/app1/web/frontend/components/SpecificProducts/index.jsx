import { useState, useCallback } from 'react';
import React from 'react';
import {
  TextField,
  Card,
  Avatar,
  ResourceList,
  ResourceItem,
  Icon,
  Modal,
  TextContainer,
} from '@shopify/polaris';
import { MobileCancelMajor, SearchMinor } from '@shopify/polaris-icons';
import '../../styles/components/SpecificProducts.css';
import productAll from '../../data/productAll';

function SpecificProducts() {
  const [active, setActive] = useState(false);
  const [valueSearch, setValueSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [lstSearchProduct, setLstSearchProduct] = useState(productAll);

  const onToggleModalClick = useCallback(() => {
    setActive((prev) => !prev);
  }, []);

  const handleSelect = useCallback(() => {
    onToggleModalClick();
  }, []);

  const handleSearchChange = useCallback((value) => {
    setValueSearch(value);
    const lstProducts = productAll.filter((product) =>
      product.name.toUpperCase().includes(value.toUpperCase())
    );

    setLstSearchProduct(lstProducts);
  }, []);
  return (
    <div className="specific-products">
      <TextField onFocus={onToggleModalClick} autoComplete="off" />
      <Card>
        <ResourceList
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={() => productAll.filter((product) => selectedItems.includes(product.id))}
          renderItem={(item) => {
            const { id, url, avatarSource, name, location } = item;

            return (
              <ResourceItem
                key={id}
                id={id}
                url={url}
                media={
                  <Avatar customer size="Large" name={name} source={avatarSource} shape="square" />
                }
                accessibilityLabel={`View details for ${name}`}
                name={name}
              >
                <div className="resourceItem">
                  <div style={{ lineHeight: '60px' }}>{location}</div>
                  <Icon source={MobileCancelMajor} color="base" />
                </div>
              </ResourceItem>
            );
          }}
        />
      </Card>
      <Modal
        open={active}
        onClose={onToggleModalClick}
        title="Select Specific Products"
        primaryAction={{
          content: 'Select',
          onAction: handleSelect,
        }}
      >
        <Modal.Section>
          <TextContainer>
            <TextField
              prefix={<Icon source={SearchMinor} />}
              label="Search tags"
              labelHidden
              value={valueSearch}
              placeholder="Search tags"
              onChange={handleSearchChange}
            />
            <Card>
              <ResourceList
                resourceName={{ singular: 'customer', plural: 'customers' }}
                items={lstSearchProduct}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                selectable
                renderItem={(item) => {
                  const { id, url, avatarSource, name, location } = item;

                  return (
                    <ResourceItem
                      key={id}
                      id={id}
                      url={url}
                      media={
                        <Avatar
                          customer
                          size="Large"
                          name={name}
                          source={avatarSource}
                          shape="square"
                        />
                      }
                      accessibilityLabel={`View details for ${name}`}
                      name={name}
                    >
                      <div style={{ lineHeight: '60px' }}>{name}</div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default SpecificProducts;
