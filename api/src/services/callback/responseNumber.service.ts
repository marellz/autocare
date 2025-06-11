import RequestService from "../request/request.service";
import VendorService from "../vendor/vendor.service";
import VendorRequestService from "../vendor/vendorRequest.service";

export const matchRequestNumber = async (inbound: { body: string; phone: string }) => {
  const { body, phone } = inbound;
  const emptyVendorResponse = { vendorRequest: null, trimmedBody: body };
  const match = body.match(/#(\d+)/i);
  const _requestId = match ? match[1] : null;

  if (!match || _requestId) return emptyVendorResponse;

  const _request = await RequestService.findOne({
    id: match[1],
  });

  if (!_request) return emptyVendorResponse;

  const request = _request.get();
  const _vendor = await VendorService.findByPhone(phone);
  const vendor = _vendor?.get();

  if (!vendor) return emptyVendorResponse;

  const _vendorRequest = await VendorRequestService.findOne({
    vendorId: vendor.id,
    requestId: request.id,
  });

  if (!_vendorRequest)
    return {
      vendorRequest: null,
    };

  return {
    vendorRequest: _vendorRequest.get(),
    trimmedBody: body.replace(match[0], "").trim(),
  };
};
