/**
 * @file
 * Global VUE Components
 * Used in library: vue
 *
 * Use this file to register components globally
 * This configuration will be set in @/bootstrap/app.ts
 */

import { ComponentOptions } from '../misc'

import { Await } from '../components/utils/Await'
import { Modal } from '../components/utils/Modal'
import { Tip } from '../components/utils/Tip'
import { ResourceInput } from '../components/utils/ResourceInput'
import { ResourceRender } from '../components/utils/ResourceRender'
import TransitionExpand from '../components/utils/TransitionExpand'

import { AdapOrderby } from '../components/adap/AdapOrderby'
import { AdapPagination } from '../components/adap/AdapPagination'
import { AdapSearchfield } from '../components/adap/AdapSearchfield'

import { InputCheckbox } from '../components/input/InputCheckbox'
import { InputSelect } from '../components/input/InputSelect'
import { InputText } from '../components/input/InputText'
import { InputTextarea } from '../components/input/InputTextarea'

import { RenderAnchor } from '../components/render/RenderAnchor'
import { RenderImage } from '../components/render/RenderImage'

/**
 * Global VUE Components
 */
export const defaultComponents: ComponentOptions = {
  Await,
  Modal,
  Tip,
  ResourceInput,
  ResourceRender,
  TransitionExpand,
  AdapOrderby,
  AdapPagination,
  AdapSearchfield,
  InputCheckbox,
  InputSelect,
  InputText,
  InputTextarea,
  RenderAnchor,
  RenderImage,
}
